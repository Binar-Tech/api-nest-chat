import { Module } from '@nestjs/common';
import { ChamadosModule } from 'src/chamados/chamados.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [ChamadosModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
