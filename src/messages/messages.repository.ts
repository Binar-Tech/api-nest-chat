import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getActualDateTimeFormattedToFirebird } from 'src/utils/date-utils';
import { CreateMessageDto } from './dto/create-message.dto';
import { ReturnMessageDto } from './dto/return-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  //busca mensagem com id_chamado
  async findMessagesByIdChamado(
    id_chamado: number,
    skip: string,
    limit: string,
  ): Promise<Message[]> {
    //const db = this.connectionService.getMainDatabase();
    //ROWS (:limit * (:skyp - 1)) + 1 TO (:limit * :skyp)`,
    const result = await new Promise<Message[]>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM MENSAGENS WHERE ID_CHAMADO = ? ORDER BY ID_MENSAGEM DESC
         ROWS (? * (? - 1)) + 1 TO (? * ?)`,
        [id_chamado, limit ?? 999999, skip ?? 1, limit ?? 999999, skip ?? 1],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Message, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result.map((chamado) => new ReturnMessageDto(chamado));
  }

  async findMessagesByCnpjAndOperadorAndIdMessage(
    id_mensagem: number,
    cnpj: string,
    operador: string,
    skip: string,
    limit: string,
  ): Promise<Message[]> {
    //const db = this.connectionService.getMainDatabase();
    //ROWS (:limit * (:skyp - 1)) + 1 TO (:limit * :skyp)`,
    const result = await new Promise<Message[]>((resolve, reject) => {
      this.db.query(
        `SELECT M.* FROM MENSAGENS M 
         LEFT JOIN CHAMADOS C ON M.ID_CHAMADO = C.ID_CHAMADO
         WHERE C.CNPJ_OPERADOR = ?
         AND C.ID_OPERADOR = ?
         AND M.ID_MENSAGEM < ? 
         ORDER BY M.ID_MENSAGEM DESC
         ROWS 1 TO ?`,
        [cnpj, operador, id_mensagem, limit ?? 999999],
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Message, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return result.map((chamado) => new ReturnMessageDto(chamado));
  }

  async createMessage(message: CreateMessageDto): Promise<Message> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Message>((resolve, reject) => {
      const date = getActualDateTimeFormattedToFirebird();
      const params = [
        message.id_chamado,
        date,
        message.mensagem,
        message.remetente,
        message.tecnico_responsavel || null,
      ];
      this.db.query(
        `insert into MENSAGENS (ID_CHAMADO, "DATA", MENSAGEM, REMETENTE, TECNICO_RESPONSAVEL)
        values (?, ?, ?, ?, ?)
        returning ID_MENSAGEM, "DATA", MENSAGEM, NOME_ARQUIVO, CAMINHO_ARQUIVO_FTP, REMETENTE, ID_TECNICO, TECNICO_RESPONSAVEL
        `,
        params,
        (err, result) => {
          if (err) return reject(err);
          const plained = plainToInstance(Message, result, {
            excludeExtraneousValues: true,
          });
          resolve(result); // Confirmando o tipo explicitamente
        },
      );
    });

    return new ReturnMessageDto(result);
  }
}
