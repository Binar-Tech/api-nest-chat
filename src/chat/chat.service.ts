import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChamadosService } from 'src/chamados/chamados.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { AcceptCallDto } from './dto/accept-call.dto';
import { CloseCallDto } from './dto/close-call.dto';
import { LoginDto } from './dto/login.dto';
import { loadChats } from './functions/load-chats-tecnico';
import { Call } from './interface/call.interface';
import { User } from './interface/user.interface';

@Injectable()
export class ChatService {
  private users: Map<string, User> = new Map(); // socketId -> User
  private calls: Map<number, Call> = new Map(); // chatId -> Call

  constructor(private readonly chamadosService: ChamadosService) {
    this.initialize();
  }
  private async initialize() {
    const calls = await this.chamadosService.findChamadosByStatusOpen();
    calls.map((call) => {
      const called: Call = {
        id_chamado: call.id_chamado,
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

    await loadChats(this.chamadosService, user, this.calls);
    console.log(`Usuário logado: ${data.nome} (${client.id})`);
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
      id_chamado: 1,
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
  acceptCall(client: Socket, data: AcceptCallDto) {
    const call = this.calls.get(data.chatId);
    if (call) {
      const technician = this.users.get(client.id);
      if (!technician || technician.type !== 'TECNICO') {
        console.log('Apenas técnicos podem aceitar chamadas.');
        return;
      }

      // Adiciona o técnico à chamada como "OWNER"
      call.technicianSockets.push({
        user: technician,
        role: 'OWNER',
      });

      // Notifica o cliente que o técnico aceitou o chat
      client.to(call.clientSocket.socketId).emit('chatAccepted', {
        chatId: data.chatId,
        technicianId: technician.socketId,
      });

      console.log(`Chat ${data.chatId} aceito pelo técnico ${technician.nome}`);
    }
  }

  // Enviar uma mensagem
  sendMessage(client: Socket, data: CreateMessageDto) {
    const call = this.calls.get(data.id_chamado);
    if (call) {
      const sender = this.users.get(client.id);
      if (!sender) {
        console.log('Remetente não encontrado.');
        return;
      }

      // Salvar a mensagem no banco de dados (implementar lógica)
      const message = {
        chatId: data.id_chamado,
        from: sender.nome,
        message: data.mensagem,
      };

      // Enviar a mensagem para o cliente
      client.to(call.clientSocket.socketId).emit('receiveMessage', message);

      // Enviar a mensagem para todos os técnicos do chat
      call.technicianSockets.forEach((tech) => {
        client.to(tech.user.socketId).emit('receiveMessage', message);
      });

      console.log(`Mensagem enviada no chat ${data.id_chamado}`);
    }
  }

  // Entrar em um chat como visualizador
  enterChat(client: Socket, chatId: number) {
    const call = this.calls.get(chatId);
    if (call) {
      const user = this.users.get(client.id);
      if (!user || user.type !== 'TECNICO') {
        console.log('Apenas técnicos podem entrar como visualizadores.');
        return;
      }

      // Adiciona o técnico à chamada como "OBSERVER"
      call.technicianSockets.push({
        user,
        role: 'OBSERVER',
      });

      console.log(
        `Técnico ${user.nome} entrou no chat ${chatId} como visualizador.`,
      );
    }
  }

  // Sair de um chat
  leaveChat(client: Socket, chatId: number) {
    const call = this.calls.get(chatId);
    if (call) {
      call.technicianSockets = call.technicianSockets.filter(
        (tech) => tech.user.socketId !== client.id,
      );
      console.log(`Usuário ${client.id} saiu do chat ${chatId}`);
    }
  }

  // Fechar um chat
  closeCall(client: Socket, data: CloseCallDto) {
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
