import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { DbModule } from 'src/db/db.module';
import { FtpController } from './ftp.controller';
import { FtpService } from './ftp.service';

@Module({
  imports: [CacheModule.register(), DbModule, ChatModule],
  providers: [FtpService],
  controllers: [FtpController],
  exports: [CacheModule],
})
export class FtpModule {}
