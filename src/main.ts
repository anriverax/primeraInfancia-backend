import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import * as process from "node:process";
/* eslint-disable */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
        [
            process.env.SERVER_URL,
            'http://localhost:3000'
        ],
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.use(cookieParser()); // Configura cookie-parser

  await app.listen(3001, () =>
    console.log(`
🚀 Server ready at: http://localhost:3001`)
  );
}

bootstrap();
