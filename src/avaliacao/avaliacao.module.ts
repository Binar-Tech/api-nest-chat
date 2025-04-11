import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoRepository } from './avaliacao.repository';
import { AvaliacaoService } from './avaliacao.service';

@Module({
  imports: [DbModule],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService, AvaliacaoRepository],
})
export class AvaliacaoModule {}
