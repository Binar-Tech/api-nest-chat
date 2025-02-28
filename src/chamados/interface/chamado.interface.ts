import { Expose } from 'class-transformer';

export class Chamado {
  @Expose()
  id_chamado: number;

  @Expose()
  tecnico_responsavel: string;

  @Expose()
  cnpj_operador: string;

  @Expose()
  nome_operador: string;

  @Expose()
  contato: string;

  @Expose()
  id_operador: number;

  @Expose()
  data_abertura: string;

  @Expose()
  data_fechamento: string;

  @Expose()
  status: string;

  @Expose()
  link_operador: string;

  @Expose()
  id_ticket: string;
}
