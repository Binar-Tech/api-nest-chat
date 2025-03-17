import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Client } from 'basic-ftp';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { PassThrough } from 'stream';

@Injectable()
export class FtpService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private async connectFtp() {
    const client = new Client();
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    return client;
  }

  async getImage(filePath: string, res: any): Promise<void> {
    try {
      const cacheKey = createHash('md5').update(filePath).digest('hex');
      const cachedData = await this.cache.get<Buffer>(cacheKey);

      if (cachedData) {
        console.log('Servindo do cache.');
        res.setHeader(
          'Content-Type',
          mime.lookup(filePath) || 'application/octet-stream',
        );
        res.send(cachedData);
        return;
      }

      const client = await this.connectFtp();
      const passThroughStream = new PassThrough();
      res.setHeader(
        'Content-Type',
        mime.lookup(filePath) || 'application/octet-stream',
      );
      passThroughStream.pipe(res);

      let data: Buffer[] = [];
      passThroughStream.on('data', (chunk) => data.push(chunk));
      passThroughStream.on('end', () => {
        const buffer = Buffer.concat(data);
        this.cache.set(cacheKey, buffer);
      });

      await client.downloadTo(passThroughStream, filePath);
      client.close();
    } catch (error) {
      console.error('Erro ao acessar o FTP:', error.message);
      throw new InternalServerErrorException('Erro ao acessar o FTP.');
    }
  }

  async getVideo(filePath: string, req: any, res: any): Promise<void> {
    try {
      const localFilePath = path.join(
        __dirname,
        '../../uploads',
        path.basename(filePath),
      );

      if (fs.existsSync(localFilePath)) {
        console.log('Servindo vídeo do armazenamento local.');
        return this.serveVideoFromLocal(localFilePath, req, res);
      }

      const client = await this.connectFtp();
      console.log(`Baixando ${filePath} do FTP para ${localFilePath}`);
      await client.downloadTo(localFilePath, filePath);
      client.close();

      this.serveVideoFromLocal(localFilePath, req, res);
    } catch (error) {
      console.error('Erro ao acessar o FTP:', error.message);
      throw new InternalServerErrorException('Erro ao acessar o FTP.');
    }
  }

  private serveVideoFromLocal(localFilePath: string, req: any, res: any): void {
    const stat = fs.statSync(localFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const mimeType = mime.lookup(localFilePath) || 'application/octet-stream';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(localFilePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });
      fs.createReadStream(localFilePath).pipe(res);
    }
  }
}
