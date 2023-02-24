import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(`${PORT}`, () => {
    console.log('server listen port = 3001');
  });
}
bootstrap();
