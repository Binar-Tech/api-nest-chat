import { verify } from 'jsonwebtoken';
import { UserAuthDto } from 'src/auth/dtos/user-auth.dto';
import { UnauthorizedException } from 'src/exceptions/unauthorized-exception';

export const PASSWORD_JWT = 'binar132878';

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
