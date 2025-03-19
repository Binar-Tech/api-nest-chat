import { forwardRef, Module } from '@nestjs/common';
import { ChamadosModule } from 'src/chamados/chamados.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [forwardRef(() => ChamadosModule), MessagesModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
