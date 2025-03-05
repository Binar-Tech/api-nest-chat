import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
}
