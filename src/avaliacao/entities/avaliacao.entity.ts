import { Expose } from 'class-transformer';

export class Avaliacao {
  @Expose()
  id: string;

  @Expose()
  nota: number;

  @Expose()
  fk_suporte_avaliacao: string;

  @Expose()
  fk_ticket: string;

  @Expose()
  idn_email: string;

  @Expose()
  id_chamado: number;

  @Expose()
  data_update: string;

  @Expose()
  data_insert: string;

  @Expose()
  pergunta: string;
}
