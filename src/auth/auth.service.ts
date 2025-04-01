import { Injectable } from '@nestjs/common';
import { verifyToken } from 'src/utils/auth';
import { UserAuthDto } from './dtos/user-auth.dto';

@Injectable()
export class AuthService {
  async getUserByToken(jwt: string): Promise<UserAuthDto> {
    return await verifyToken(jwt);
  }
}
