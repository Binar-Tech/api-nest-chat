import { CallUser } from './call-user.intarface';
import { User } from './user.interface';

export interface Call {
  chatId: string;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
