import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

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
    }
  }
}
