import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  app.use(helmet());
  await app.listen(3001, () => {
    console.log('server listen port = 3001');
  });
}
bootstrap();
