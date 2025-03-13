import { Chamado } from '../interface/chamado.interface';
import { EmpresaDto } from './empresa.dto';

export class ReturnChamadoDto {
  id_chamado: number;
  tecnico_responsavel: string;
  cnpj_operador: string;
  nome_operador: string;
  contato: string;
  id_operador: number;
  data_abertura: string;
  data_fechamento: string;
  status: string;
  link_operador: string;
  id_ticket: string;
  empresa: EmpresaDto;

  constructor(chamado: Chamado) {
    this.id_chamado = chamado.id_chamado;
    this.tecnico_responsavel = chamado.tecnico_responsavel;
    this.cnpj_operador = chamado.cnpj_operador;
    this.nome_operador = chamado.nome_operador;
    this.contato = chamado.contato;
    this.id_operador = chamado.id_operador;
    this.data_abertura = chamado.data_abertura;
    this.data_fechamento = chamado.data_fechamento;
    this.status = chamado.status;
    this.link_operador = chamado.link_operador;
    this.id_ticket = chamado.id_ticket;
    this.empresa = new EmpresaDto(chamado);
  }
}
