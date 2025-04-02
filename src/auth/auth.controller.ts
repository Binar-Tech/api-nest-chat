import { Controller, Get, Param, Query } from '@nestjs/common';
import { PerfilEnum } from 'src/chat/enums/perfil.enum';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dtos/user-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async generateJwt(
    @Query('id') id: string,
    @Query('nome') nome: string,
    @Query('cnpj') cnpj: string,
    @Query('type') type: PerfilEnum,
    @Query('link_operador') link_operador: string,
  ): Promise<string> {
    return this.authService.generateJwt(id, nome, cnpj, type, link_operador);
  }

  @Get('/:token')
  async getUserByToken(@Param('token') token: string): Promise<UserAuthDto> {
    return this.authService.getUserByToken(token);
  }
}
