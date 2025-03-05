import { Message } from '../entities/message.entity';

export class ReturnMessageDto {
  id_mensagem: number;
  id_chamado: number;
  data: string;
  mensagem: string;
  nome_arquivo: string;
  caminho_arquivo_ftp: string;
  remetente: string;
  id_tecnico: string;
  tecnico_responsavel: string;

  constructor(message: Message) {
    this.id_mensagem = message.id_mensagem;
    this.id_chamado = message.id_chamado;
    this.data = message.data;
    this.mensagem = message.mensagem;
    this.nome_arquivo = message.nome_arquivo;
    this.caminho_arquivo_ftp = message.caminho_arquivo_ftp;
    this.remetente = message.remetente;
    this.id_tecnico = message.id_tecnico;
    this.tecnico_responsavel = message.tecnico_responsavel;
  }
}
