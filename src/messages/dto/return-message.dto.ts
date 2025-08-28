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
  message_reply?: ReturnMessageDto;

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

    if (message.reply_id_mensagem) {
      this.message_reply = {
        id_mensagem: message.reply_id_mensagem,
        id_chamado: message.reply_id_chamado,
        data: message.reply_data,
        mensagem: message.reply_mensagem,
        nome_arquivo: message.reply_nome_arquivo,
        caminho_arquivo_ftp: message.reply_caminho_arquivo_ftp,
        remetente: message.reply_remetente,
        id_tecnico: message.reply_id_tecnico,
        tecnico_responsavel: message.reply_tecnico_responsavel,
      };
    }
  }
}
