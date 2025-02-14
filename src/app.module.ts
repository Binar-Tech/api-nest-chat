import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChamadosModule } from './chamados/chamados.module';
import { ChatModule } from './chat/chat.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // permite acesso global às variáveis de ambiente
      envFilePath: '.env',
    }),
    ChatModule,
    ChamadosModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
