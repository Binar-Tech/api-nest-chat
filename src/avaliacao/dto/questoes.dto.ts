import { Avaliacao } from '../entities/avaliacao.entity';

export class QuestoesDto {
  id: string;
  nota: number;
  fk_suporte_avaliacao: string;
  fk_ticket: string;
  idn_email: string;
  id_chamado: number;
  data_update: string;
  data_insert: string;
  pergunta?: string | null;

  constructor(questoes: Avaliacao) {
    this.id = questoes.id;
    this.nota = questoes.nota;
    this.fk_suporte_avaliacao = questoes.fk_suporte_avaliacao;
    this.fk_ticket = questoes.fk_ticket;
    this.idn_email = questoes.idn_email;
    this.id_chamado = questoes.id_chamado;
    this.data_update = questoes.data_update;
    this.data_insert = questoes.data_insert;
    this.pergunta = questoes.pergunta;
  }
}
