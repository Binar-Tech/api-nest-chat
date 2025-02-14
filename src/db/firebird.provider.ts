import { Provider } from '@nestjs/common';
import * as Firebird from 'node-firebird';

//Configurações de conexão com o Firebird
const options = {
  host: '187.73.185.68',
  //host: '187.73.185.69',
  port: 3050,
  database: '/SEC/BANCO/WSACESSO/WSACESSO.FDB',
  user: 'SYSDBA',
  password: 'masterkey',
  retryConnectionInterval: 1000,
  blobAsText: true,
  lowercase_keys: true,
};

export const FirebirdProvider: Provider = {
  provide: 'FIREBIRD_CONNECTION',
  useFactory: (): Promise<Firebird.Database> => {
    const database = process.env.DATABASE;
    const host = process.env.HOST;
    const port = Number(process.env.PORT);
    options.database = database;
    options.host = host;
    options.port = port;
    console.log('database:', options);
    return new Promise((resolve, reject) => {
      Firebird.attach(options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  },
};
