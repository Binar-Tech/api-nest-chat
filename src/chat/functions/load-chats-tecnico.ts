import { ChamadosService } from 'src/chamados/chamados.service';
import { CallUser } from '../interface/call-user.intarface';
import { Call } from '../interface/call.interface';
import { User } from '../interface/user.interface';

export async function loadChats(
  chamadoService: ChamadosService,
  user: User,
  callsMap: Map<number, Call>,
): Promise<Map<number, Call>> {
  if (user.type === 'TECNICO') {
    return await loadChatsTecnico(chamadoService, user, callsMap);
  } else {
    return await loadChatOperador(chamadoService, user, callsMap);
  }
}

async function loadChatsTecnico(
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
      clientSocket: user,
      technicianSockets: [...(existingCall?.technicianSockets ?? []), callUser], // Garante que não seja undefined
    });
  }
  return null;
}

async function loadChatOperador(
  chamadoService: ChamadosService,
  user: User,
  callsMap: Map<number, Call>,
): Promise<Map<number, Call>> {
  const call = await chamadoService.findChamadosByCnpjAndOperador(
    user.cnpj!,
    user.id!,
  );

  // Percorrendo os chamados e inserindo no Map

  const existingCall = callsMap.get(call.id_chamado);
  if (existingCall && call) {
    callsMap.set(existingCall.id_chamado, {
      id_chamado: existingCall.id_chamado,
      clientSocket: existingCall.clientSocket,
      technicianSockets: existingCall.technicianSockets, // Garante que não seja undefined
    });
  }

  return null;
}
