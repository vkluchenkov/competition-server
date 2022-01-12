import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async sign(user: UserDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
