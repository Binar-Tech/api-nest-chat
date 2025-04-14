import { Inject, Injectable } from '@nestjs/common';
import { UpdateAllAvaliacaoDto } from './dto/update-all-avaliacao.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@Injectable()
export class AvaliacaoRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  async findQuestionsByIdChamado(idChamado: number): Promise<Avaliacao[]> {
    const result = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        `SELECT ta.*, sa.pergunta FROM ticket_avaliacao ta 
        left join suporte_avaliacao sa on sa.id = ta.fk_suporte_avaliacao 
        WHERE ta.id_chamado = ?
        `,
        [idChamado],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    return result;
  }

  async gerarAvaliacao(idChamado: number): Promise<Avaliacao[]> {
    // 1. Verifica se já existe avaliação para o ticket
    const avaliacaoExistente = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM ticket_avaliacao WHERE id_chamado = ?',
        [idChamado],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    if (avaliacaoExistente.length > 0) {
      return avaliacaoExistente;
    }

    // 2. Busca 3 perguntas aleatórias para o tipo de suporte
    const perguntas = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        `SELECT FIRST 3 a.ID, a.PERGUNTA, a.fk_TIPO_SUPORTE
         FROM suporte_avaliacao a
         WHERE a.fk_TIPO_SUPORTE = ? AND a.ATIVO = 1
         ORDER BY RAND()`,
        ['5526DDF5-8CFB-473C-88EB-5C9483760CC0'],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    if (perguntas.length === 0) {
      return null;
    }

    // 3. Insere perguntas no ticket_avaliacao
    for (const pergunta of perguntas) {
      await new Promise<void>((resolve, reject) => {
        this.db.query(
          `INSERT INTO ticket_avaliacao (id, nota, fk_SUPORTE_AVALIACAO, fk_TICKET, id_chamado)
           VALUES (?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID().toUpperCase(), // ou use algum gerador se Firebird não usar UUIDs
            0, // nota inicial como null
            pergunta.id,
            null,
            idChamado,
          ],
          (err) => (err ? reject(err) : resolve()),
        );
      });
    }

    const questions = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM ticket_avaliacao WHERE id_chamado = ?',
        [idChamado],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    return questions;
  }

  async updateQuestion(idQuestion: string, nota: number): Promise<Avaliacao> {
    const updated = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        'UPDATE ticket_avaliacao SET nota = ? WHERE id = ?',
        [nota, idQuestion],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    const question = await new Promise<any[]>((resolve, reject) => {
      this.db.query(
        'SELECT * FROM ticket_avaliacao WHERE id = ?',
        [idQuestion],
        (err, result) => (err ? reject(err) : resolve(result)),
      );
    });

    return question[0];
  }

  async updateAllQuestions(questions: UpdateAllAvaliacaoDto[]): Promise<any> {
    questions.map(async (question) => {
      await new Promise<any[]>((resolve, reject) => {
        this.db.query(
          'UPDATE ticket_avaliacao SET nota = ? WHERE id = ?',
          [question.nota, question.idQuestion],
          (err, result) => (err ? reject(err) : resolve(result)),
        );
      });
    });
  }
}
