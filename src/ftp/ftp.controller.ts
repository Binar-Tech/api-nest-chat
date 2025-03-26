import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FtpService } from './ftp.service';

@Controller('files')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('')
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

  @Get('/videos')
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

  @Post('/:cnpj')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../uploads', // Diretório temporário antes de enviar ao FTP
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('body') body: string,
    @Param('cnpj') cnpj: string,
  ) {
    return await this.ftpService.uploadFile(file, body, cnpj);
  }
}
