import { forwardRef, Module } from '@nestjs/common';
import { AvaliacaoModule } from 'src/avaliacao/avaliacao.module';
import { ChatModule } from 'src/chat/chat.module';
import { DbModule } from 'src/db/db.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { ChamadosController } from './chamados.controller';
import { ChamadosRepository } from './chamados.repository';
import { ChamadosService } from './chamados.service';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    DbModule,
    GatewayModule,
    AvaliacaoModule,
  ],
  providers: [ChamadosService, ChamadosRepository],
  controllers: [ChamadosController],
  exports: [ChamadosService],
})
export class ChamadosModule {}
