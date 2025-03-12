import { PerfilEnum } from '../enums/perfil.enum';

export interface User {
  nome: string;
  cnpj?: string;
  socketId: string;
  type: PerfilEnum;
  id?: string;
}
