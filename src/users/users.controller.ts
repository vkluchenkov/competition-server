import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from './user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user: User) => this.usersService.userModelToDto(user));
  }

  @Get('data')
  async getProfile(@Request() req): Promise<UserDto> {
    const user = await this.usersService.findOneById(req.user.id);
    return this.usersService.userModelToDto(user);
  }
}
