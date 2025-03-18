import { ChamadosService } from 'src/chamados/chamados.service';
import { ReturnChamadoDto } from 'src/chamados/dtos/returnChamado.dto';
import { PerfilEnum } from '../enums/perfil.enum';
import { RoleEnum } from '../enums/role.enum';
import { CallUser } from '../interface/call-user.intarface';
import { Call } from '../interface/call.interface';
import { User } from '../interface/user.interface';

export async function loadChats(
  chamadoService: ChamadosService,
  user: User,
  callsMap: Map<number, Call>,
): Promise<Call> {
  if (user.type === PerfilEnum.TECNICO) {
    await loadChatsTecnico(chamadoService, user, callsMap);
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
    role: RoleEnum.OWNER,
    user,
  };

  // Percorrendo os chamados e inserindo no Map
  for (const call of callsArray) {
    const existingCall = callsMap.get(call.id_chamado);

    callsMap.set(call.id_chamado, {
      chamado: existingCall.chamado,
      clientSocket: existingCall.clientSocket ?? null,
      technicianSockets: [...(existingCall?.technicianSockets ?? []), callUser], // Garante que não seja undefined
    });
  }
  return null;
}

async function loadChatOperador(
  chamadoService: ChamadosService,
  user: User,
  callsMap: Map<number, Call>,
): Promise<Call> {
  const call = new ReturnChamadoDto(
    await chamadoService.findChamadosByCnpjAndOperador(user.cnpj!, user.id!),
  );

  if (!call) {
    console.warn('Nenhum chamado encontrado para o usuário:', user.id);
    return null; // Retorna o mapa inalterado
  }

  // Verifica se já existe o chamado no Map
  let existingCall = callsMap.get(call.id_chamado);

  // Atualiza o Map com os dados do chamado
  callsMap.set(call.id_chamado, {
    chamado: call,
    clientSocket: user || null,
    technicianSockets: existingCall.technicianSockets || [],
  });
  existingCall = callsMap.get(call.id_chamado);
  return existingCall;
}
