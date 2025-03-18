import { RoleEnum } from '../enums/role.enum';

export interface EnterChatDto {
  chatId: number;
  role: RoleEnum;
}
