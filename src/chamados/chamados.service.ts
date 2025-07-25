import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AvaliacaoService } from 'src/avaliacao/avaliacao.service';
import { ChatService } from 'src/chat/chat.service';
import { PerfilEnum } from 'src/chat/enums/perfil.enum';
import { Call } from 'src/chat/interface/call.interface';
import { Gateway } from 'src/gateway/gateway';
import { ChamadosRepository } from './chamados.repository';
import { CreateChamadoDto } from './dtos/create-chamado.dto';
import { LastSevenCallsDto } from './dtos/lastSevenCalls.dto';
import { ReturnChamadoDto } from './dtos/returnChamado.dto';
import { StatusChamadoEnum } from './enum/status-chamado.enum';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosService {
  constructor(
    private readonly chamadosRepository: ChamadosRepository,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly gateway: Gateway,
    private readonly avaliacaoService: AvaliacaoService,
  ) {}
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<Chamado> {
    return await this.chamadosRepository.findChamadosByCnpjAndOperador(
      cnpj,
      idOperador,
    );
  }

  async findChamadosByStatusOpen(): Promise<ReturnChamadoDto[]> {
    const result = await this.chamadosRepository.findChamadosByStatusOpen();
    if (result) {
      return result.map((chamado) => new ReturnChamadoDto(chamado));
    }

    return [];
  }

  async findChamadosByStatusNotClosed(): Promise<ReturnChamadoDto[]> {
    const result =
      await this.chamadosRepository.findChamadosByStatusNotClosed();
    if (result) {
      return result.map((chamado) => new ReturnChamadoDto(chamado));
    }

    return [];
  }

  async findChamadosByNomeTecnico(idTecnico: string): Promise<Chamado[]> {
    return await this.chamadosRepository.findChamadosByNomeTecnico(idTecnico);
  }

  async findChamadosByiD(idChamado: number): Promise<Chamado> {
    return await this.chamadosRepository.findChamadosById(idChamado);
  }

  async findChamadosByOperadorAndCnpj(
    nomeOperador: string,
    cnpj: string,
  ): Promise<Chamado[]> {
    return await this.chamadosRepository.findChamadosByOperadorAndCnpj(
      nomeOperador,
      cnpj,
    );
  }

  async updateChamadoById(
    idChamado: number,
    idTecnico: string,
  ): Promise<Chamado> {
    return await this.chamadosRepository.updateChamadoById(
      idChamado,
      idTecnico,
    );
  }

  async updateChamadoSetToClosed(idChamado: number): Promise<Chamado> {
    const result = await this.chamadosRepository.updateChamadoSetToClosed(
      idChamado,
      StatusChamadoEnum.AVALIAR,
    );
    const call = this.chatService.getCalls().get(idChamado);
    const usersConnected = this.chatService.getUsersConnected();

    if (call) {
      call.chamado = new ReturnChamadoDto(result);
    }

    //GERAR QUESTOES PARA AVALIAÇÃO
    await this.avaliacaoService.create(idChamado);

    if (call) {
      if (call.clientSocket && call.clientSocket.socketId) {
        this.gateway.server
          .to(call.clientSocket.socketId)
          .emit('closed-call', call);
      }
      usersConnected.forEach((user) => {
        if (user.type === PerfilEnum.TECNICO) {
          this.gateway.server.to(user.socketId).emit('closed-call', result);
        }
      });
    }

    return result;
  }
  async updateChamadoByIdSetToClosed(idChamado: number): Promise<Call> {
    const result =
      await this.chamadosRepository.updateChamadoSetToClosed(idChamado);
    const call = this.chatService.getCalls().get(idChamado);
    this.chatService.deleteCallById(idChamado);
    return call;
  }

  async findLastSevenCalls(): Promise<LastSevenCallsDto[]> {
    const result = await this.chamadosRepository.findLastSevenCalls();

    if (result) {
      return result.map((chamado) => new LastSevenCallsDto(chamado));
    }

    return [];
  }

  async updateChamadoSetToClosedWithoutTicket(
    idChamado: number,
  ): Promise<Chamado> {
    const result =
      await this.chamadosRepository.updateChamadoSetToClosed(idChamado);
    const call = this.chatService.getCalls().get(idChamado);
    const usersConnected = this.chatService.getUsersConnected();
    if (call) {
      call.chamado = new ReturnChamadoDto(result);
      call.technicianSockets.find((c) => c.user.id);
      if (call.clientSocket && call.clientSocket.socketId) {
        this.gateway.server
          .to(call.clientSocket.socketId)
          .emit('closed-call', call);
      }

      usersConnected.forEach((user) => {
        if (user.type === PerfilEnum.TECNICO) {
          const index = call.technicianSockets.findIndex(
            (c) => c.user.id === user.id,
          );
          //envia para todos os tecnicos, menos para o dono do chamado
          if (index < 0) {
            this.gateway.server.to(user.socketId).emit('closed-call', result);
          }
        }
      });
    }

    return result;
  }

  async findAllChamadosPaginated(
    skip: string,
    limit: string,
  ): Promise<ReturnChamadoDto[]> {
    const result = await this.chamadosRepository.findAllChamadosPaginated(
      skip,
      limit,
    );
    if (result) {
      return result.map((chamado) => new ReturnChamadoDto(chamado));
    }

    return [];
  }

  async createChamado(chamado: CreateChamadoDto): Promise<ReturnChamadoDto> {
    const retorno = await this.chamadosRepository.createChamado(chamado);
    let returnChamado = null;
    if (retorno) {
      returnChamado = await this.chamadosRepository.findChamadosById(
        retorno.id_chamado,
      );
    }
    if (returnChamado) {
      const retornoFormatado = new ReturnChamadoDto(returnChamado);
      this.chatService.insertCall(retornoFormatado);
      const userConected = this.chatService.getUsersConnected();
      if (userConected) {
        userConected.forEach((user) => {
          if (user.type === PerfilEnum.TECNICO) {
            this.gateway.server
              .to(user.socketId)
              .emit('open-call', retornoFormatado);
          }
        });
      }

      return retornoFormatado;
    }

    throw new Error('Erro ao criar chamado');
  }
}
