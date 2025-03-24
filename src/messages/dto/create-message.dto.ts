export class CreateMessageDto {
  id_chamado: number;
  mensagem: string | null;
  remetente: string;
  nome_arquivo?: string | null;
  tecnico_responsavel?: string | null;
  caminho_arquivo_ftp?: string | null;
}
