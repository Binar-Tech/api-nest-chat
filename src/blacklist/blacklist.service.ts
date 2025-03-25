import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { BlacklistRepository } from './blacklist.repository';

@Injectable()
export class BlacklistService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly repo: BlacklistRepository,
  ) {}
  async findBlacklistByIdTecnico(idTecnico: string): Promise<Array<string>> {
    const cacheKey = createHash('md5').update(idTecnico).digest('hex');
    const cachedData = await this.cache.get<Array<string>>(cacheKey);
    if (cachedData) {
      console.log('Servindo do cache.');

      return cachedData;
    }
    const data = await this.repo.findBlacklistByIdTecnico(idTecnico);
    await this.cache.set(cacheKey, data, 60000);
    return data;
  }
}
