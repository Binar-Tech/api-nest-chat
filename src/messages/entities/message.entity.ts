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

  @Expose()
  id_mensagem_reply: string;

  @Expose()
  reply_id_mensagem: number;

  @Expose()
  reply_id_chamado: number;

  @Expose()
  reply_data: string;

  @Expose()
  reply_mensagem: string;

  @Expose()
  reply_nome_arquivo: string;

  @Expose()
  reply_caminho_arquivo_ftp: string;

  @Expose()
  reply_remetente: string;

  @Expose()
  reply_id_tecnico: string;

  @Expose()
  reply_tecnico_responsavel: string;

  @Expose()
  reply_id_mensagem_reply: string;
}
