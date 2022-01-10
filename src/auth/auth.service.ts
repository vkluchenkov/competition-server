import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOneByEmailAndPass(email, password);
  //   if (user && user.password === password) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: UserDto) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
