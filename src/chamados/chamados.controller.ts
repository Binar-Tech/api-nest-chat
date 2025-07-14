import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ChamadosService } from './chamados.service';
import { CreateChamadoDto } from './dtos/create-chamado.dto';
import { ReturnChamadoDto } from './dtos/returnChamado.dto';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}
  @Get()
  async findChamadosByCnpjAndOperador(
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

  @Get('/tecnico')
  async findChamadosByNomeTecnico(
    @Query('idTecnico') idTecnico: string | null,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chamadosService.findChamadosByNomeTecnico(
        idTecnico.length == 0 ? null : idTecnico,
      );
      if (result) {
        const convert = result.map((call) => new ReturnChamadoDto(call));
        return res.status(HttpStatus.OK).json(convert);
      }

      return res.status(HttpStatus.OK).json([]);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/open')
  async findChamadosByStatusOpen(@Res() res: Response) {
    try {
      const result = await this.chamadosService.findChamadosByStatusOpen();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/last-seven-calls')
  async findLastSevenCalls(@Res() res: Response) {
    try {
      const result = await this.chamadosService.findLastSevenCalls();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('/paginated')
  async findAllChamadosPaginated(
    @Res() res: Response,
    @Query('skip') skip: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const result = await this.chamadosService.findAllChamadosPaginated(
        skip,
        limit,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:idChamado')
  async updateChamadoSetToClosed(
    @Param('idChamado') idChamado: string, // Extrai corretamente da rota
    @Res() res: Response, // Indica explicitamente que estamos usando Response
  ) {
    try {
      const result = await this.chamadosService.updateChamadoSetToClosed(
        Number(idChamado),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar o chamado',
        error: error.message,
      });
    }
  }

  @Patch('/close/:idChamado')
  async updateChamadoByIdSetToClosed(
    @Param('idChamado') idChamado: string, // Extrai corretamente da rota
    @Res() res: Response, // Indica explicitamente que estamos usando Response
  ) {
    try {
      const result = await this.chamadosService.updateChamadoByIdSetToClosed(
        Number(idChamado),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao atualizar o chamado',
        error: error.message,
      });
    }
  }

  @Patch('/withoutticket/:idChamado')
  async updateChamadoSetToClosedWithoutticket(
    @Param('idChamado') idChamado: string,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.chamadosService.updateChamadoSetToClosedWithoutTicket(
          Number(idChamado),
        );
      let retorno;
      if (result) {
        retorno = new ReturnChamadoDto(result);
        return res.status(HttpStatus.OK).json(retorno);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createChamado(
    @Body() createChamadoDto: CreateChamadoDto, // Extrai corretamente do corpo
    @Res() res: Response,
  ) {
    try {
      const result = await this.chamadosService.createChamado(createChamadoDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } // Indica explicitamente que estamos usando Response
}
