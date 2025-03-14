import { Module } from '@nestjs/common';
import { ChamadosModule } from 'src/chamados/chamados.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [ChamadosModule, MessagesModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
