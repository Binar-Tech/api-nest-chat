import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChamadosService } from 'src/chamados/chamados.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { AcceptCallDto } from './dto/accept-call.dto';
import { CloseCallDto } from './dto/close-call.dto';
import { EnterChatDto } from './dto/enter-chat.dto';
import { LoginDto } from './dto/login.dto';
import { ReturnMessageSocketDto } from './dto/return-message.dto';
import { PerfilEnum } from './enums/perfil.enum';
import { RoleEnum } from './enums/role.enum';
import { acceptCall, EnterCall, LeaveCall } from './functions/calls';

import { ReturnAcceptCallDto } from './dto/return-accept-call.dto';
import { loadChats } from './functions/load-chats-tecnico';
import { Call } from './interface/call.interface';
import { User } from './interface/user.interface';

@Injectable()
export class ChatService {
  private users: Map<string, User> = new Map(); // socketId -> User
  private calls: Map<number, Call> = new Map(); // chatId -> Call

  constructor(
    @Inject(forwardRef(() => ChamadosService))
    private readonly chamadosService: ChamadosService,
    private readonly messageService: MessagesService,
  ) {
    this.listCalls();
  }
  private async listCalls() {
    const calls = await this.chamadosService.findChamadosByStatusOpen();
    calls.map((call) => {
      const called: Call = {
        chamado: call,
        clientSocket: null,
        technicianSockets: [],
      };
      this.calls.set(call.id_chamado, called);
    });
  }
  getUsersConnected(): Map<string, User> {
    return this.users;
  }

  getCalls(): Map<number, Call> {
    return this.calls;
  }
  // Conexão de um usuário
  handleConnection(client: Socket) {
    console.log(`Usuário conectado: ${client.id}`);
  }

  // Desconexão de um usuário
  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);
    if (user) {
      this.users.delete(client.id);
      console.log(`Usuário desconectado: ${user.nome} (${client.id})`);
    }

    //remover o user de calls
    this.calls.forEach((call) => {
      const index = call.technicianSockets.findIndex(
        (socket) => socket.user.socketId === client.id,
      );
      if (index !== -1) {
        call.technicianSockets.splice(index, 1);
      }
    });
  }

  // Login de um usuário
  async handleLogin(client: Socket, data: LoginDto) {
    const user: User = {
      nome: data.nome,
      cnpj: data.cnpj,
      socketId: client.id,
      type: data.type,
      id: data.id,
    };

    this.users.set(client.id, user);

    const call = await loadChats(this.chamadosService, user, this.calls);
    console.log(`Usuário logado: ${data.nome} (${client.id})`);

    // Notificar apenas os usuários dentro das chamadas ativas
    if (call) {
      //notifica o próprio usuario retoronando o id da call
      client.emit('logged', call);

      if (call.technicianSockets.length > 0) {
        call.technicianSockets.forEach((tecnico) => {
          client.to(tecnico.user.socketId).emit('logged', call);
        });
      }
    }
  }

  // Iniciar um novo chat
  startChat(client: Socket) {
    // GRAVAR NO BANCO E RETORNAR O ID DA TABELA
    const chatId = Date.now().valueOf();

    // Obtém o usuário que está iniciando o chat
    const user = this.users.get(client.id);
    if (!user) {
      console.log('Usuário não encontrado.');
      return;
    }

    // Cria uma nova chamada
    this.calls.set(chatId, {
      chamado: null,
      clientSocket: user, // Armazena o usuário (cliente) que iniciou o chat
      technicianSockets: [], // Lista de técnicos/observadores
    });

    // Notifica todos os técnicos sobre o novo chat
    this.users.forEach((user, socketId) => {
      if (user.type === 'TECNICO') {
        client.to(socketId).emit('newChat', { chatId });
      }
    });

    console.log(`Novo chat iniciado: ${chatId}`);
  }

  // Aceitar um chat
  async acceptCall(client: Socket, data: AcceptCallDto) {
    const call = this.calls.get(data.chatId);
    if (call) {
      const technician = this.users.get(client.id);
      if (!technician || technician.type !== PerfilEnum.TECNICO) {
        console.log('Apenas técnicos podem aceitar chamadas.');
        return;
      }

      //atualiza o chamado no banco de dados
      await this.chamadosService.updateChamadoById(
        data.chatId,
        data.technicianId,
      );

      //busca o chamado no banco para retornar atualizado para o cliente
      const chamado = new ReturnAcceptCallDto(
        await this.chamadosService.findChamadosByiD(data.chatId),
        technician.nome,
      );

      //busca os dados do user logado
      const user = this.users.get(client.id);

      // Adiciona o técnico à chamada como "OWNER"
      acceptCall(user, data.chatId, chamado, this.calls);
      //remove todos outros tecnicos que não seja owner
      LeaveCall(user, data.chatId, this.calls);

      // Notifica o cliente que o técnico aceitou o chat
      if (call.clientSocket) {
        client.to(call.clientSocket.socketId).emit('accepted-call', chamado);
      }

      // Enviar a mensagem para todos os técnicos do chat
      if (call.technicianSockets.length > 0) {
        call.technicianSockets.forEach((tecnico) => {
          if (client.id === tecnico.user.socketId)
            client.emit('accepted-call', chamado);
          else client.to(tecnico.user.socketId).emit('accepted-call', chamado);
        });
      }

      console.log(`Chat ${data.chatId} aceito pelo técnico ${technician.nome}`);
    }
  }

  // Enviar uma mensagem
  async sendMessage(client: Socket, data: CreateMessageDto) {
    const call = this.calls.get(data.id_chamado);
    if (call) {
      // Salvar a mensagem no banco de dados (implementar lógica)
      const result = await this.messageService.createMessage(data);

      if (!result) {
        return;
      }

      const returnMessage = new ReturnMessageSocketDto(result, data.id_chamado);

      // Enviar a mensagem para o cliente
      if (call.clientSocket) {
        if (returnMessage.remetente === PerfilEnum.OPERADOR)
          client.emit('new-message', returnMessage);
        else
          client
            .to(call.clientSocket.socketId)
            .emit('new-message', returnMessage);
      }

      // Enviar a mensagem para todos os técnicos do chat
      if (call.technicianSockets.length > 0) {
        call.technicianSockets.forEach((tecnico) => {
          if (client.id === tecnico.user.socketId)
            client.emit('new-message', returnMessage);
          else
            client.to(tecnico.user.socketId).emit('new-message', returnMessage);
        });
      }
    }
  }

  // Entrar em um chat como visualizador
  enterChat(client: Socket, message: EnterChatDto) {
    const call = this.calls.get(message.chatId);
    if (call) {
      const user = this.users.get(client.id);
      if (!user || user.type !== PerfilEnum.TECNICO) {
        console.log('Apenas técnicos podem entrar como visualizadores.');
        return;
      }

      // Adiciona o técnico à chamada como "OBSERVER" ou "SUPPORT"
      EnterCall(user, message.chatId, message.role, this.calls);

      if (message.role === RoleEnum.OBSERVER) {
        console.log(
          `Técnico ${user.nome} entrou no chat ${message.chatId} como ${message.role}.`,
        );
        return;
      }

      if (call.clientSocket) {
        client.to(call.clientSocket.socketId).emit('entered-call', user.nome);
      }

      // Enviar a mensagem para todos os técnicos do chat
      if (call.technicianSockets.length > 0) {
        call.technicianSockets.forEach((tecnico) => {
          if (client.id === tecnico.user.socketId)
            client.emit('entered-call', user.nome);
          else client.to(tecnico.user.socketId).emit('entered-call', user.nome);
        });
      }

      console.log(
        `Técnico ${user.nome} entrou no chat ${message.chatId} como ${message.role}.`,
      );
    }
  }

  // Sair de um chat
  leaveChat(client: Socket, message: EnterChatDto) {
    const call = this.calls.get(message.chatId);
    if (call) {
      const user = this.users.get(client.id);

      LeaveCall(user, message.chatId, this.calls);

      console.log(`Usuário ${client.id} saiu do chat ${message.chatId}`);
    }
  }

  // Fechar um chat
  closeChat(client: Socket, data: CloseCallDto) {
    const call = this.calls.get(data.id_chamado);
    if (call) {
      // Notifica o cliente
      client.to(call.clientSocket.socketId).emit('closeCall', data);

      // Notifica todos os técnicos
      call.technicianSockets.forEach((tech) => {
        client.to(tech.user.socketId).emit('closeCall', data);
      });

      this.calls.delete(data.id_chamado);
      console.log(`Chat ${data.id_chamado} fechado`);
    }
  }
}
