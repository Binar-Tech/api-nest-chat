import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlacklistModule } from './blacklist/blacklist.module';
import { ChamadosModule } from './chamados/chamados.module';
import { ChatModule } from './chat/chat.module';
import { DbModule } from './db/db.module';
import { FtpController } from './ftp/ftp.controller';
import { FtpModule } from './ftp/ftp.module';
import { FtpService } from './ftp/ftp.service';
import { GatewayModule } from './gateway/gateway.module';
import { MessagesModule } from './messages/messages.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';

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
    BlacklistModule,
    GatewayModule,
    RoleModule,
  ],
  controllers: [AppController, FtpController, RoleController],
  providers: [AppService, FtpService],
})
export class AppModule {}
