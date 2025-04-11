import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Controller('avaliacao')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post('/:idChamado')
  async create(@Param('idChamado') idChamado: number) {
    return await this.avaliacaoService.create(idChamado);
  }

  @Get()
  findAll() {}

  @Get(':id')
  async findQuestionByIdChamado(@Param('id') id: string) {
    return await this.avaliacaoService.findQuestionsByIdChamado(+id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateAvaliacaoDto: UpdateAvaliacaoDto,
  ) {
    return this.avaliacaoService.update(id, updateAvaliacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
