import { Controller, Get, Param } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  findAll(@Param() idTecnico: string) {
    return this.blacklistService.findBlacklistByIdTecnico(idTecnico);
  }
}
