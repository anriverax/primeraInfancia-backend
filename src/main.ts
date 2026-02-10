import { ValidationPipe, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import * as process from "node:process";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
/* eslint-disable */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix("/api");
  app.enableCors({
    origin: process.env.SERVER_URL,
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
  app.use(cookieParser());

  await app.listen(3001, () => logger.log("Server ready at: http://localhost:3001"));
}

bootstrap();
