require('./env');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.DB_HOST);
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.set('strict routing', true);
  httpAdapter.set('case sensitive routing', true);
  await app.listen(3000);
}
bootstrap();
