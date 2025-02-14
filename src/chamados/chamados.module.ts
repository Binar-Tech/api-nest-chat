import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ChamadosController } from './chamados.controller';
import { ChamadosRepository } from './chamados.repository';
import { ChamadosService } from './chamados.service';

@Module({
  imports: [DbModule],
  providers: [ChamadosService, ChamadosRepository],
  controllers: [ChamadosController],
  exports: [ChamadosService],
})
export class ChamadosModule {}
