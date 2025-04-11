import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getActualDateTimeFormattedToFirebird } from 'src/utils/date-utils';
import { CreateChamadoDto } from './dtos/create-chamado.dto';
import { Chamado } from './interface/chamado.interface';

@Injectable()
export class ChamadosRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  async createChamado(chamado: CreateChamadoDto): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const date = getActualDateTimeFormattedToFirebird();
    const params = [
      chamado.nome_operador,
      chamado.cnpj_operador,
      chamado.contato,
      chamado.id_operador,
      date,
      null,
      'ABERTO',
      chamado.link_operador || null,
    ];
    const result = await new Promise<Chamado>((resolve, reject) => {
      this.db.query(
        `insert into CHAMADOS (NOME_OPERADOR, CNPJ_OPERADOR, CONTATO, ID_OPERADOR,
                      DATA_ABERTURA, DATA_FECHAMENTO, STATUS, LINK_OPERADOR)
            values (?, ?, ?, ?, ?, ?, ?, ?)
            returning ID_CHAMADO, TECNICO_RESPONSAVEL, NOME_OPERADOR, CNPJ_OPERADOR, CONTATO, ID_OPERADOR,
            DATA_ABERTURA, DATA_FECHAMENTO, STATUS, LINK_OPERADOR, ID_TICKET`,
        params,
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Chamado, result, {
            excludeExtraneousValues: true,
          }) as Chamado;
          resolve(plained); // Confirmando o tipo explicitamente
        },
      );
    });

    return result || null;
  }

  //busca acessos com IDN_BIONOTIFICA = S
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM CHAMADOS WHERE CNPJ_OPERADOR = ? AND ID_OPERADOR = ? AND STATUS <> ?',
        [cnpj, idOperador, 'FECHADO'],
        (err, result) => {
          if (err) return reject(err);

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
        `SELECT C.*, E.FANTASIA, E.RAZAO_SOCIAL, E.SERVICO, E.CELULAR, E.EMAIL, E.TELEFONE,
         U.NAME AS NAME_TECNICO, U.EMAIL AS EMAIL_TECNICO 
         FROM CHAMADOS C 
         LEFT JOIN EMPRESA E ON E.CNPJ = C.CNPJ_OPERADOR 
         LEFT JOIN "USER" U ON U.ID = C.TECNICO_RESPONSAVEL
         WHERE STATUS = ?`,
        ['ABERTO'],
        (err, result) => {
          if (err) return reject(err);

          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result;
  }

  async findChamadosById(idChamado: number): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado[]>((resolve, reject) => {
      this.db.query(
        //'SELECT C.*, E.FANTASIA, E.RAZAO_SOCIAL, E.SERVICO, E.CELULAR, E.EMAIL, E.TELEFONE FROM CHAMADOS C LEFT JOIN EMPRESA E ON E.CNPJ = C.CNPJ_OPERADOR WHERE ID_CHAMADO = ?',
        `SELECT C.*, E.FANTASIA, E.RAZAO_SOCIAL, E.SERVICO, E.CELULAR, E.EMAIL, E.TELEFONE,
         U.NAME AS NAME_TECNICO, U.EMAIL AS EMAIL_TECNICO 
         FROM CHAMADOS C 
         LEFT JOIN EMPRESA E ON E.CNPJ = C.CNPJ_OPERADOR 
         LEFT JOIN "USER" U ON U.ID = C.TECNICO_RESPONSAVEL
         WHERE ID_CHAMADO = ?`,
        [idChamado],
        (err, result) => {
          if (err) return reject(err);

          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result[0];
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
  ): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado>((resolve, reject) => {
      this.db.query(
        `UPDATE CHAMADOS SET TECNICO_RESPONSAVEL = ? WHERE ID_CHAMADO = ?
        RETURNING ID_CHAMADO, TECNICO_RESPONSAVEL, NOME_OPERADOR, CNPJ_OPERADOR, CONTATO, ID_OPERADOR, 
        DATA_ABERTURA, DATA_FECHAMENTO, STATUS, LINK_OPERADOR, ID_TICKET`,
        [idTecnico, idChamado],
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

  async updateChamadoSetToClosed(idChamado: number): Promise<Chamado> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Chamado>((resolve, reject) => {
      this.db.query(
        `UPDATE CHAMADOS SET STATUS = ? WHERE ID_CHAMADO = ?
        RETURNING ID_CHAMADO, TECNICO_RESPONSAVEL, NOME_OPERADOR, CNPJ_OPERADOR, CONTATO, ID_OPERADOR, 
        DATA_ABERTURA, DATA_FECHAMENTO, STATUS, LINK_OPERADOR, ID_TICKET`,
        ['FECHADO', idChamado],
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
