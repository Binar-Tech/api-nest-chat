import { Injectable } from '@nestjs/common';
import { AvaliacaoRepository } from './avaliacao.repository';
import { QuestoesDto } from './dto/questoes.dto';
import { UpdateAllAvaliacaoDto } from './dto/update-all-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly avaliacaoRepository: AvaliacaoRepository) {}
  async create(idChamado: number): Promise<Avaliacao[]> {
    return await this.avaliacaoRepository.gerarAvaliacao(idChamado);
  }

  async findQuestionsByIdChamado(id: number): Promise<QuestoesDto[]> {
    const result = await this.avaliacaoRepository.findQuestionsByIdChamado(id);
    if (result.length > 0) {
      return result.map((questao) => new QuestoesDto(questao));
    }
    return;
  }

  async update(id: string, updateQuestion: UpdateAvaliacaoDto): Promise<any> {
    return await this.avaliacaoRepository.updateQuestion(
      id,
      updateQuestion.nota,
    );
  }

  async updateAll(
    body: UpdateAllAvaliacaoDto[],
    idChamado: number,
  ): Promise<any> {
    const result = await this.avaliacaoRepository.updateAllQuestions(body);

    if (result) {
      //await this.chamadoService.updateChamadoByIdSetToClosed(idChamado);
    }

    return result;
  }
}
