import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository {
  constructor(@Inject('FIREBIRD_CONNECTION') private readonly db: any) {}

  //busca mensagem com id_chamado
  async findByIdTecnico(idTecnico: string): Promise<Array<string>> {
    //const db = this.connectionService.getMainDatabase();

    const result = await new Promise<Array<{ id: string }>>(
      (resolve, reject) => {
        this.db.query(
          `select upper(id) as id from role where fk_user = ?`,
          [idTecnico],
          (err, result) => {
            if (err) return reject(err);

            resolve(result); // Confirmando o tipo explicitamente
          },
        );
      },
    );

    return result.map((row) => row.id) || [];
  }
}
