import { Provider } from '@nestjs/common';
import * as Firebird from 'node-firebird';

// Configurações de conexão com o Firebird
const options = {
  host: process.env.HOST || '10.0.1.38',
  port: Number(process.env.PORT) || 3050,
  database:
    process.env.DATABASE ||
    'D:/Trabalho/Controle Banco/Biofinger/Banco/ticket.fdb',
  user: process.env.DB_USER || 'SYSDBA',
  password: process.env.DB_PASSWORD || 'masterkey',
  retryConnectionInterval: 1000,
  blobAsText: true,
  lowercase_keys: true,
};

// Criando o pool de conexões
const pool = Firebird.pool(10, options); // Definindo 10 conexões no pool

export const FirebirdProvider: Provider = {
  provide: 'FIREBIRD_CONNECTION',
  useFactory: (): Promise<Firebird.Database> => {
    return new Promise((resolve, reject) => {
      pool.get((err, db) => {
        if (err) {
          console.error('Erro ao obter conexão do pool:', err);
          reject(err);
        } else {
          console.log('Conexão Firebird obtida do pool');
          resolve(db);
        }
      });
    });
  },
};
