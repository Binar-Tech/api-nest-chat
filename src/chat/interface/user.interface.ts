export interface User {
  nome: string;
  cnpj?: string;
  socketId: string;
  type: 'TECNICO' | 'OPERADOR';
}
