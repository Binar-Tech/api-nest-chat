import { forwardRef, Module } from '@nestjs/common';
import { BlacklistModule } from 'src/blacklist/blacklist.module';
import { ChamadosModule } from 'src/chamados/chamados.module';
import { MessagesModule } from 'src/messages/messages.module';
import { RoleModule } from 'src/role/role.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    forwardRef(() => ChamadosModule),
    MessagesModule,
    BlacklistModule,
    RoleModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
