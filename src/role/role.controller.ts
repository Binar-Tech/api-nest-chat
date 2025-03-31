import { Controller, Get, Param } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  PASSWORD_JWT = 'binar132878';
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Get()
  generateJwt() {
    return sign(
      {
        id: 'E4491F91-3828-4E25-A73E-F00D26BCFA57',
        nome: 'MARCOS',
        cnpj: null,
        type: 'TECNICO',
      },
      this.PASSWORD_JWT,
      {
        expiresIn: '12h',
      },
    );
  }
}
