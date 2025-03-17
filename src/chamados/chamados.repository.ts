import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  //busca acessos com IDN_BIONOTIFICA = S
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM CHAMADOS WHERE CNPJ_OPERADOR = ? AND ID_OPERADOR = ? AND STATUS = ?',
        [cnpj, idOperador, 'ABERTO'],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result[0] || null;
  }

  async findChamadosByStatusOpen(): Promise<Chamado[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT C.*, E.FANTASIA, E.RAZAO_SOCIAL, E.SERVICO, E.CELULAR, E.EMAIL, E.TELEFONE FROM CHAMADOS C LEFT JOIN EMPRESA E ON E.CNPJ = C.CNPJ_OPERADOR WHERE STATUS = ?',
        ['ABERTO'],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }

  async findChamadosById(idChamado: number): Promise<Chamado[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT C.*, E.FANTASIA, E.RAZAO_SOCIAL, E.SERVICO, E.CELULAR, E.EMAIL, E.TELEFONE FROM CHAMADOS C LEFT JOIN EMPRESA E ON E.CNPJ = C.CNPJ_OPERADOR WHERE ID_CHAMADO = ?',
        [idChamado],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }

  async findChamadosByNomeTecnico(
    tecnicoResponsavel: string,
  ): Promise<Chamado[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM CHAMADOS WHERE TECNICO_RESPONSAVEL = ? AND STATUS = ?',
        [tecnicoResponsavel, 'ABERTO'],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }

  async findChamadosByOperadorAndCnpj(
    tecnicoResponsavel: string,
    cnpj: string,
  ): Promise<Chamado[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM CHAMADOS WHERE NOME_OPERADOR = ? AND STATUS = ? AND CNPJ_OPERADOR = ?',
        [tecnicoResponsavel, 'ABERTO', cnpj],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }

  async updateChamadoById(
    idChamado: number,
    idTecnico: string,
  ): Promise<Chamado[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        `UPDATE CHAMADOS SET TECNICO_RESPONSAVEL = ? WHERE ID_CHAMADO = ?
        RETURNING ID_CHAMADO, TECNICO_RESPONSAVEL, NOME_OPERADOR, CNPJ_OPERADOR, CONTATO, ID_OPERADOR, 
        DATA_ABERTURA, DATA_FECHAMENTO, STATUS, LINK_OPERADOR, ID_TICKET`,
        [idTecnico, idTecnico],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }
}
