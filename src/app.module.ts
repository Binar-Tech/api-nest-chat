import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChamadosModule } from './chamados/chamados.module';
import { ChatModule } from './chat/chat.module';
import { DbModule } from './db/db.module';
import { FtpController } from './ftp/ftp.controller';
import { FtpModule } from './ftp/ftp.module';
import { FtpService } from './ftp/ftp.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // permite acesso global às variáveis de ambiente
      envFilePath: '.env',
    }),
    ChatModule,
    ChamadosModule,
    DbModule,
    MessagesModule,
    FtpModule,
  ],
  controllers: [AppController, FtpController],
  providers: [AppService, FtpService],
})
export class AppModule {}
