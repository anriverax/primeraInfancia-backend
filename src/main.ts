import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

/* eslint-disable */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000", // Cambia esto si tu frontend está en otro dominio/puerto
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

  if (process.env.NODE_ENV !== "development") {
    app.setGlobalPrefix("api", {
      exclude: [
        { path: "test/department", method: RequestMethod.GET },
        { path: "test/permission/addMenuPermission", method: RequestMethod.GET },
        { path: "test/permission/addAdminPermission", method: RequestMethod.GET }
      ]
    });
  }

  
}

bootstrap();
