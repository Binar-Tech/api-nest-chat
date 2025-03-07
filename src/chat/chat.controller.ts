import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/users-connected')
  async getUsersConnected() {
    const data = await this.chatService.getUsersConnected();

    return Array.from(data.values());
  }

  @Get('/calls')
  async getCalls() {
    const data = await this.chatService.getCalls();

    return Array.from(data.values());
  }
}
