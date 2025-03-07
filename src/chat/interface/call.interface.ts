import { CallUser } from './call-user.intarface';
import { User } from './user.interface';

export interface Call {
  id_chamado: number;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
