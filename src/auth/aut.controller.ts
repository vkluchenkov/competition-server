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
import { CodeRequestDto } from 'src/users/code-request.dto';
import { ValidateCodeDto } from 'src/users/validate-code.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() { email }: CodeRequestDto) {
    const isExists = await this.usersService.findOneByEmail(email);
    if (isExists) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } else {
      const code = this.usersService.generateCode();
      this.usersService.incompleteSignUps[email] = code;
      console.log(code);
      return 'OK';
    }
  }

  @Post('validate')
  async validateCode(@Body() { email, code }: ValidateCodeDto) {
    if (this.usersService.incompleteSignUps[email] === code) {
      return 'OK';
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  async create(
    @Body() { email, password, code, name, birthDate }: CreateUserDto,
  ) {
    if (this.usersService.incompleteSignUps[email] === code) {
      const newUser = new User();
      newUser.email = email;
      newUser.name = name;
      newUser.birth_date = birthDate;
      newUser.password = await this.authService.passwordHash(password);

      await this.usersService.create(newUser);
      const userDto = this.usersService.userModelToDto(newUser);
      delete this.usersService.incompleteSignUps[email];
      return await this.authService.sign(userDto);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
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
  async reset(@Body() { email }: CodeRequestDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      user.password_reset = this.usersService.generateCode();
    }
    await this.usersService.update(user);
    console.log(user.password_reset);
    return 'OK';
  }

  @Post('resetcheck')
  async resetcheck(@Body() { email, code }: ValidateCodeDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password_reset === code) {
      return 'OK';
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('setpass')
  async setpass(@Body() req: CreateUserDto) {
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
