import { PerfilEnum } from 'src/chat/enums/perfil.enum';

export interface UserAuthDto {
  id: string;
  nome: string;
  cnpj?: string | null;
  type: PerfilEnum;
  link_operador?: string | null;
}
