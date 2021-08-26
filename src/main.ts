import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 3000;
const prefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.setGlobalPrefix(prefix);

  if (!process.env.JWT_SECRET_KEY)
    throw new Error('env var JWT_SECRET_KEY must be defined');

  await app.listen(port);
}

bootstrap();
