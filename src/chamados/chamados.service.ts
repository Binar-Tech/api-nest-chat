import { Injectable } from '@nestjs/common';
import { ChamadosRepository } from './chamados.repository';

@Injectable()
export class ChamadosService {
  constructor(private readonly chamadosRepository: ChamadosRepository) {}
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<any> {
    return await this.chamadosRepository.findChamadosByCnpjAndOperador(
      cnpj,
      idOperador,
    );
  }
}
