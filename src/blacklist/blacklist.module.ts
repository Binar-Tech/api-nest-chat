import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { BlacklistController } from './blacklist.controller';
import { BlacklistRepository } from './blacklist.repository';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [CacheModule.register(), DbModule],
  controllers: [BlacklistController],
  providers: [BlacklistService, BlacklistRepository],
  exports: [BlacklistService],
})
export class BlacklistModule {}
