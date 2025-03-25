import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly repo: RoleRepository) {}

  async findOne(idTecnico: string): Promise<Array<string>> {
    return await this.repo.findByIdTecnico(idTecnico);
  }
}
