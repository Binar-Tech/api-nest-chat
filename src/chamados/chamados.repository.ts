import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ChamadosRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  //busca acessos com IDN_BIONOTIFICA = S
  async findChamadosByCnpjAndOperador(
    cnpj: string,
    idOperador: string,
  ): Promise<any> {
    //const db = this.connectionService.getMainDatabase();
    return new Promise((resolve, reject) => {
      this.db.query(
        'SELECT * FROM CHAMADOS WHERE CNPJ_OPERADOR = ? AND ID_OPERADOR = ?',
        [cnpj, idOperador],
        (err, result) => {
          if (err) return reject(err);

          resolve(result[0] || {}); // Confirmando o tipo explicitamente
        },
      );
    });
  }
}
