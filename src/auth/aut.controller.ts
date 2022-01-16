import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { LoginUserDto } from 'src/users/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ResetPassReqDto } from 'src/users/reset-pass-req.dto';
import { ResetPassCodeDto } from 'src/users/reset-pass-code.dto';
import { SetPassDto } from 'src/users/set-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async create(@Body() req: CreateUserDto) {
    const isExists = await this.usersService.findOneByEmail(req.email);

    if (isExists) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } else {
      const newUser = new User();
      newUser.email = req.email;
      newUser.password = await this.authService.passwordHash(req.password);

      await this.usersService.create(newUser);

      const userDto = this.usersService.userModelToDto(newUser);

      return await this.authService.sign(userDto);
    }
  }

  @Post('login')
  async login(@Body() req: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(req.email);

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(req.password, user.password);
    if (!isMatch) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const userDto = this.usersService.userModelToDto(user);
    return await this.authService.sign(userDto);
  }

  @Post('reset')
  async reset(@Body() { email }: ResetPassReqDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      user.password_reset = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
    }
    await this.usersService.update(user);
    console.log(user.password_reset);
    return 'OK';
  }

  @Post('resetcheck')
  async resetcheck(@Body() { email, code }: ResetPassCodeDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password_reset === code) {
      return 'OK';
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('setpass')
  async setpass(@Body() req: SetPassDto) {
    const user = await this.usersService.findOneByEmail(req.email);
    if (user && user.password_reset === req.code) {
      user.password = await this.authService.passwordHash(req.password);
      user.password_reset = '';

      await this.usersService.update(user);

      const userDto = this.usersService.userModelToDto(user);

      return await this.authService.sign(userDto);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
