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

  if (!call) {
    console.warn('Nenhum chamado encontrado para o usuário:', user.id);
    return callsMap; // Retorna o mapa inalterado
  }

  // Verifica se já existe o chamado no Map
  let existingCall = callsMap.get(call.id_chamado);

  if (!existingCall) {
    existingCall = {
      id_chamado: call.id_chamado,
      clientSocket: null, // Defina um valor inicial adequado
      technicianSockets: [], // Inicializa o Set vazio
    };
  }

  // Atualiza o Map com os dados do chamado
  callsMap.set(call.id_chamado, {
    id_chamado: call.id_chamado,
    clientSocket: user || null,
  });

  return callsMap;
}
