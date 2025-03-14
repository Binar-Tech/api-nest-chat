export class CreateMessageDto {
  id_chamado: number;
  mensagem: string;
  remetente: string;
  nome_arquivo?: string | null;
  tecnico_responsavel?: string | null;
}
