process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: '*',
  // });

  app.enableCors({
    origin: 'http://localhost:3000', // Specify the Next.js app origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(5000, () => {
    console.log('Gateway service listening on port 5000');
  });
}

bootstrap();
