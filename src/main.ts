import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // loads .env file into process.env
 const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  // console.log(port);
  console.log('DB USER:', process.env.DATABASE_USER);
}
bootstrap();
