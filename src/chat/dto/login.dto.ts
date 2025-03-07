export class LoginDto {
  nome: string;
  cnpj?: string;
  type: 'OPERADOR' | 'TECNICO';
  id: string;
}
