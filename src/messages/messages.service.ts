import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ReturnMessageDto } from './dto/return-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessagesRepository) {}
  async createMessage(createMessageDto: CreateMessageDto) {
    return await this.messageRepository.createMessage(createMessageDto);
  }

  async findMessagesByIdChamado(
    id_chamado: number,
    skip: string,
    limit: string,
  ): Promise<ReturnMessageDto[]> {
    return await this.messageRepository.findMessagesByIdChamado(
      id_chamado,
      skip,
      limit,
    );
  }

  async findMessagesByCnpjAndOperadorAndIdMessage(
    cnpj: string,
    id_mensagem: number | null,
    operador: string,
    skip: string,
  ): Promise<ReturnMessageDto[]> {
    return await this.messageRepository.findMessagesByCnpjAndOperadorAndIdMessage(
      id_mensagem,
      cnpj,
      operador,
      skip,
    );
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
