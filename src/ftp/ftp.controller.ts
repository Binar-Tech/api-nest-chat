import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FtpService } from './ftp.service';

@Controller('files')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('images')
  async getImage(
    @Query('path') filePath: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!filePath) {
      res.status(400).send('Parâmetro "path" é obrigatório.');
      return;
    }
    await this.ftpService.getImage(filePath, res);
  }

  @Get('videos')
  async getVideo(
    @Query('path') filePath: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!filePath) {
      res.status(400).send('Parâmetro "path" é obrigatório.');
      return;
    }
    await this.ftpService.getVideo(filePath, req, res);
  }
}
