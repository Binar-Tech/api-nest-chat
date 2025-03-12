import { PerfilEnum } from '../enums/perfil.enum';

export class LoginDto {
  nome: string;
  cnpj?: string;
  type: PerfilEnum;
  id: string;
}
