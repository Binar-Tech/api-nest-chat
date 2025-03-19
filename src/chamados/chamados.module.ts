import { forwardRef, Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { DbModule } from 'src/db/db.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { ChamadosController } from './chamados.controller';
import { ChamadosRepository } from './chamados.repository';
import { ChamadosService } from './chamados.service';

@Module({
  imports: [forwardRef(() => ChatModule), DbModule, GatewayModule],
  providers: [ChamadosService, ChamadosRepository],
  controllers: [ChamadosController],
  exports: [ChamadosService],
})
export class ChamadosModule {}
