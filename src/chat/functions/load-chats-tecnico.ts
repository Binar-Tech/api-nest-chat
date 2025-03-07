import { ChamadosService } from 'src/chamados/chamados.service';
import { CallUser } from '../interface/call-user.intarface';
import { Call } from '../interface/call.interface';
import { User } from '../interface/user.interface';

export async function loadChatsTecnico(
  chamadoService: ChamadosService,
  user: User,
  callsMap: Map<number, Call>,
): Promise<Map<number, Call>> {
  const callsArray = await chamadoService.findChamadosByNomeTecnico(user.id!);

  const callUser: CallUser = {
    role: 'OWNER',
    user,
  };

  // Percorrendo os chamados e inserindo no Map
  for (const call of callsArray) {
    const existingCall = callsMap.get(call.id_chamado);
    callsMap.set(call.id_chamado, {
      id_chamado: existingCall.id_chamado,
      clientSocket: existingCall.clientSocket,
      technicianSockets: [...(existingCall?.technicianSockets ?? []), callUser], // Garante que não seja undefined
    });
  }
  return null;
}
