import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { Gateway } from 'src/gateway/gateway';
import { ChamadosRepository } from './chamados.repository';
import { ReturnChamadoDto } from './dtos/returnChamado.dto';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosService {
  constructor(
    private readonly chamadosRepository: ChamadosRepository,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly gateway: Gateway,
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

    return result.map((chamado) => new ReturnChamadoDto(chamado));
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
    if (call) {
      this.gateway.server
        .to(call.clientSocket.socketId)
        .emit('closed-call', result);

      call.technicianSockets.map((tecnico) => {
        this.gateway.server
          .to(tecnico.user.socketId)
          .emit('closed-call', result);
      });
    }

    return result;
  }
}
