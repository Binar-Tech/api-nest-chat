import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [DbModule],
  controllers: [BlacklistController],
  providers: [BlacklistService],
})
export class BlacklistModule {}
