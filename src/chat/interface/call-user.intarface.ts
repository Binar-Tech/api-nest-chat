import { User } from './user.interface';

export interface CallUser {
  user: User;
  role: 'OWNER' | 'OBSERVER' | 'SUPPORT';
}
