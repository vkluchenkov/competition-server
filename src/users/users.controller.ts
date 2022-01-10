import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   const isExists = await this.usersService.findOneByEmail(
  //     createUserDto.email,
  //   );

  //   if (isExists) {
  //     throw new HttpException('Conflict', HttpStatus.CONFLICT);
  //   } else {
  //     const newUser = new User();
  //     newUser.email = createUserDto.email;
  //     newUser.password = createUserDto.password;
  //     await this.usersService.create(newUser);
  //   }
  // }

  // @Post('login')
  // async findOne(@Body() loginUserDto: LoginUserDto) {
  //   const userModelToDto = (userEntity: User) => {
  //     return {
  //       id: userEntity.user_id,
  //       email: userEntity.email,
  //     };
  //   };

  //   const isLogin = await this.usersService.findOneByEmailAndPass(
  //     loginUserDto.email,
  //     loginUserDto.password,
  //   );

  //   if (!isLogin) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }

  //   const userDto = userModelToDto(isLogin);
  //   return await this.authService.login(userDto);
  // }
}
