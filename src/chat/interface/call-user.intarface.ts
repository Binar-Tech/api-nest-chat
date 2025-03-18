import { RoleEnum } from '../enums/role.enum';
import { User } from './user.interface';

export interface CallUser {
  user: User;
  role: RoleEnum;
}
