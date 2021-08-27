import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const prefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') app.enableCors();
  if (!process.env.PORT) throw new Error('missing PORT');
  if (!process.env.JWT_SECRET_KEY) throw new Error('missing JWT_SECRET_KEY');
  if (!process.env.API_PREFIX) throw new Error('missing API_PREFIX');

  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.setGlobalPrefix(prefix);

  await app.listen(process.env.PORT);
}
bootstrap()
  .then()
  .catch((err) => {
    console.error('Unhandled Error');

    console.error(err);
  });
