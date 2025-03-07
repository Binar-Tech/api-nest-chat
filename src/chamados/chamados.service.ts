import { Injectable } from '@nestjs/common';
import { ChamadosRepository } from './chamados.repository';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosService {
  constructor(private readonly chamadosRepository: ChamadosRepository) {}
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<Chamado[]> {
    return await this.chamadosRepository.findChamadosByCnpjAndOperador(
      cnpj,
      idOperador,
    );
  }

  async findChamadosByStatusOpen(): Promise<Chamado[]> {
    return await this.chamadosRepository.findChamadosByStatusOpen();
  }

  async findChamadosByNomeTecnico(idTecnico: string): Promise<Chamado[]> {
    return await this.chamadosRepository.findChamadosByNomeTecnico(idTecnico);
  }
}
