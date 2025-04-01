import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dtos/user-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/:token')
  async getUserByToken(@Param('token') token: string): Promise<UserAuthDto> {
    console.log(token);
    return this.authService.getUserByToken(token);
  }
}
