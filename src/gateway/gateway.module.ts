import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { Gateway } from './gateway';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [Gateway],
  exports: [Gateway],
})
export class GatewayModule {}
