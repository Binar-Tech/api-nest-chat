import { ReturnChamadoDto } from 'src/chamados/dtos/returnChamado.dto';
import { RoleEnum } from '../enums/role.enum';
import { CallUser } from '../interface/call-user.intarface';
import { Call } from '../interface/call.interface';
import { User } from '../interface/user.interface';

export async function acceptCall(
  user: User,
  idChamado: number,
  chamado: ReturnChamadoDto,
  callsMap: Map<number, Call>,
) {
  const callUser: CallUser = {
    role: RoleEnum.OWNER,
    user,
  };

  const existingCall = callsMap.get(idChamado);

  callsMap.set(idChamado, {
    chamado: chamado,
    clientSocket: existingCall.clientSocket ?? null,
    technicianSockets: [...(existingCall?.technicianSockets ?? []), callUser], // Garante que não seja undefined
  });
}

export function EnterCall(
  user: User,
  idChamado: number,
  role: RoleEnum,
  callsMap: Map<number, Call>,
) {
  const callUser: CallUser = {
    role: role,
    user,
  };

  const existingCall = callsMap.get(idChamado);

  if (!existingCall) {
    return; // Se a chamada não existir, não faz nada
  }

  // Verifica se já existe um usuário com o mesmo socketId em technicianSockets
  const alreadyExists = existingCall.technicianSockets.some(
    (existingUser) => existingUser.user.socketId === user.socketId,
  );

  if (alreadyExists) {
    return; // Se o usuário já está na chamada, não faz nada
  }

  // Se não existir, adiciona o usuário na chamada
  callsMap.set(idChamado, {
    chamado: existingCall.chamado,
    clientSocket: existingCall.clientSocket ?? null,
    technicianSockets: [...existingCall.technicianSockets, callUser], // Adiciona o novo usuário
  });
}

export async function LeaveCall(
  user: User,
  idChamado: number,
  callsMap: Map<number, Call>,
) {
  const existingCall = callsMap.get(idChamado);

  if (!existingCall) {
    return; // Se a chamada não existir, não faz nada
  }

  // Filtra os usuários removendo aquele que tem o mesmo socketId, mas mantendo os que são OWNER
  const updatedTechnicianSockets = existingCall.technicianSockets.filter(
    (existingUser) =>
      existingUser.user.socketId !== user.socketId ||
      existingUser.role === RoleEnum.OWNER,
  );

  callsMap.set(idChamado, {
    chamado: existingCall.chamado,
    clientSocket: existingCall.clientSocket ?? null,
    technicianSockets: updatedTechnicianSockets, // Atualiza a lista sem o usuário removido
  });
}
