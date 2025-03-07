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
  async findMessagesByIdChamado(id_chamado: number): Promise<Message[]> {
    //const db = this.connectionService.getMainDatabase();
    const result = await new Promise<Message[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM MENSAGENS WHERE ID_CHAMADO = ? ORDER BY ID_MENSAGEM DESC',
        [id_chamado],
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
