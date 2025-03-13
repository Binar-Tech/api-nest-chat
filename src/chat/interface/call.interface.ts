import { ReturnChamadoDto } from 'src/chamados/dtos/returnChamado.dto';
import { CallUser } from './call-user.intarface';
import { User } from './user.interface';

export interface Call {
  chamado: ReturnChamadoDto;
  clientSocket?: User;
  technicianSockets?: CallUser[];
}
