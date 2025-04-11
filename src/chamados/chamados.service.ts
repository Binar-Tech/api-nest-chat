import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AvaliacaoService } from 'src/avaliacao/avaliacao.service';
import { ChatService } from 'src/chat/chat.service';
import { PerfilEnum } from 'src/chat/enums/perfil.enum';
import { Gateway } from 'src/gateway/gateway';
import { ChamadosRepository } from './chamados.repository';
import { CreateChamadoDto } from './dtos/create-chamado.dto';
import { ReturnChamadoDto } from './dtos/returnChamado.dto';
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
    const result =
      await this.chamadosRepository.updateChamadoSetToClosed(idChamado);
    const call = this.chatService.getCalls().get(idChamado);
    const usersConnected = this.chatService.getUsersConnected();

    //GERAR QUESTOES PARA AVALIAÇÃO
    await this.avaliacaoService.create(idChamado);

    if (call) {
      this.gateway.server
        .to(call.clientSocket.socketId)
        .emit('closed-call', result);

      usersConnected.forEach((user) => {
        if (user.type === PerfilEnum.TECNICO) {
          this.gateway.server.to(user.socketId).emit('closed-call', result);
        }
      });
    }

    return result;
  }

  async updateChamadoSetToClosedWithoutTicket(
    idChamado: number,
  ): Promise<Chamado> {
    const result =
      await this.chamadosRepository.updateChamadoSetToClosed(idChamado);
    const call = this.chatService.getCalls().get(idChamado);
    const usersConnected = this.chatService.getUsersConnected();
    if (call) {
      call.technicianSockets.find((c) => c.user.id);
      this.gateway.server
        .to(call.clientSocket.socketId)
        .emit('closed-call', result);

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
