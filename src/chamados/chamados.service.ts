import { Injectable } from '@nestjs/common';
import { ChamadosRepository } from './chamados.repository';
import { ReturnChamadoDto } from './dtos/returnChamado.dto';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosService {
  constructor(private readonly chamadosRepository: ChamadosRepository) {}
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
    return (await this.chamadosRepository.findChamadosByStatusOpen()).map(
      (chamado) => new ReturnChamadoDto(chamado),
    );
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
}
