import { sign, verify } from 'jsonwebtoken';
import { UserAuthDto } from 'src/auth/dtos/user-auth.dto';
import { PerfilEnum } from 'src/chat/enums/perfil.enum';
import { UnauthorizedException } from 'src/exceptions/unauthorized-exception';

export const PASSWORD_JWT = 'binar132878';

export const generateToken = (
  id: string,
  nome: string,
  cnpj: string,
  type: PerfilEnum,
  link_operador: string,
): string => {
  return sign(
    {
      id,
      nome,
      cnpj,
      type,
      link_operador,
    },
    PASSWORD_JWT,
    {
      expiresIn: '12h',
    },
  );
};

export const verifyToken = async (
  authorization?: string,
): Promise<UserAuthDto> => {
  if (!authorization) {
    throw new UnauthorizedException();
  }

  try {
    const decodedToken = <UserAuthDto>verify(authorization, PASSWORD_JWT);

    return decodedToken;
  } catch (error) {
    throw new UnauthorizedException();
  }
};
