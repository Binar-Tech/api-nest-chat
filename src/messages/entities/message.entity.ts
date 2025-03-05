import { Expose } from 'class-transformer';

export class Message {
  @Expose()
  id_mensagem: number;

  @Expose()
  id_chamado: number;

  @Expose()
  data: string;

  @Expose()
  mensagem: string;

  @Expose()
  nome_arquivo: string;

  @Expose()
  caminho_arquivo_ftp: string;

  @Expose()
  remetente: string;

  @Expose()
  id_tecnico: string;

  @Expose()
  tecnico_responsavel: string;
}
