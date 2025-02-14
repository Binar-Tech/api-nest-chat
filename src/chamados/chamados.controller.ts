import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChamadosService } from './chamados.service';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}
  @Get()
  async getAvaliacaoPage(
    @Query('cnpj') cnpj: string,
    @Query('idOperador') idOperador: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chamadosService.findChamadosByCnpjAndOperador(
        cnpj,
        idOperador,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
