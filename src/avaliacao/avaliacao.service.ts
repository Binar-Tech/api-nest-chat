import { Injectable } from '@nestjs/common';
import { AvaliacaoRepository } from './avaliacao.repository';
import { QuestoesDto } from './dto/questoes.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly avaliacaoRepository: AvaliacaoRepository) {}
  async create(idChamado: number) {
    return await this.avaliacaoRepository.gerarAvaliacao(idChamado);
  }

  findAll() {
    return `This action returns all avaliacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avaliacao`;
  }

  async findQuestionsByIdChamado(id: number) {
    const result = await this.avaliacaoRepository.findQuestionsByIdChamado(id);
    if (result.length > 0) {
      return result.map((questao) => new QuestoesDto(questao));
    }
    return;
  }

  async update(id: string, updateQuestion: UpdateAvaliacaoDto) {
    return await this.avaliacaoRepository.updateQuestion(
      id,
      updateQuestion.nota,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} avaliacao`;
  }
}
