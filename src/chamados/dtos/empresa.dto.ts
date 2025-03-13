import { Chamado } from '../interface/chamado.interface';

export class EmpresaDto {
  fantasia: string;
  razao_social: string;
  servico: string;
  celular: string;
  email: string;
  telefone: string;

  constructor(chamado: Chamado) {
    this.fantasia = chamado.fantasia;
    this.razao_social = chamado.razao_social;
    this.servico = chamado.servico;
    this.celular = chamado.celular;
    this.email = chamado.email;
    this.telefone = chamado.telefone;
  }
}
