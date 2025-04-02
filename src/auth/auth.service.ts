import { Injectable } from '@nestjs/common';
import { PerfilEnum } from 'src/chat/enums/perfil.enum';
import { generateToken, verifyToken } from 'src/utils/auth';
import { UserAuthDto } from './dtos/user-auth.dto';

@Injectable()
export class AuthService {
  async generateJwt(
    id: string,
    nome: string,
    cnpj: string,
    type: PerfilEnum,
    link_operador: string,
  ): Promise<string> {
    return generateToken(id, nome, cnpj, type, link_operador);
  }

  async getUserByToken(jwt: string): Promise<UserAuthDto> {
    return await verifyToken(jwt);
  }
}
