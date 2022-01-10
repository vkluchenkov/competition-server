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

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const isExists = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (isExists) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } else {
      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;
      await this.usersService.create(newUser);

      const userModelToDto = (userEntity: User) => {
        return {
          id: userEntity.user_id,
          email: userEntity.email,
        };
      };

      const userDto = userModelToDto(newUser);

      return await this.authService.login(userDto);
    }
  }

  @Post('login')
  async findOne(@Body() loginUserDto: LoginUserDto) {
    const userModelToDto = (userEntity: User) => {
      return {
        id: userEntity.user_id,
        email: userEntity.email,
      };
    };

    const isLogin = await this.usersService.findOneByEmailAndPass(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!isLogin) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const userDto = userModelToDto(isLogin);
    return await this.authService.login(userDto);
  }
}
