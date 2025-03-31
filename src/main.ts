import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import 'dotenv/config';
import { join } from 'path';
import { AppModule } from './app.module';

dotenv.config({ path: join(__dirname, '..', '.env') });

const corsOptions = {
  origin: '*', // Specify your allowed origins here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite métodos específicos
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'], // Permite cabeçalhos específicos
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOW-FROM *'); // Permite iframes de qualquer domínio
    res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Política de segurança para iframes
    next();
  });
  await app.listen(4000);
}
bootstrap();
