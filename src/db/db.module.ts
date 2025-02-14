import { Module } from '@nestjs/common';
import { FirebirdProvider } from './firebird.provider';

@Module({ providers: [FirebirdProvider], exports: [FirebirdProvider] })
export class DbModule {}
