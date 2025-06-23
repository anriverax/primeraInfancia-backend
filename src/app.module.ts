import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, RouterModule } from "@nestjs/core";
import config from "./config/config";
import { validate } from "./config/env.config";
import { AuthModule } from "./core/auth/auth.module";
import { CatalogueModule } from "./core/catalogue/catalogue.module";
import { DepartmentModule } from "./core/coutry/department/department.module";
import { MunicipalityModule } from "./core/coutry/municipality/municipality.module";
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import * as fs from "fs";
import { ProfileModule } from "./core/profile/profile.module";
import { ZoneModule } from "./core/zone/zone.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [config]
    }),
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        global: true,
        privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH!, "utf8"),
        publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, "utf8"),
        signOptions: {
          algorithm: "RS256", // Algoritmo para firmar tokens
          expiresIn: "15m" // Tiempo de vida del accessToken
        }
      })
    }),
    PrismaModule,
    AuthModule,
    DepartmentModule,
    MunicipalityModule,
    CatalogueModule,
    ProfileModule,
    ZoneModule,
    RouterModule.register([
      {
        path: "api",
        children: [
          {
            path: "auth",
            module: AuthModule
          },
          {
            path: "catalogue",
            module: CatalogueModule
          },
          {
            path: "profile",
            module: ProfileModule
          },
          {
            path: "zone",
            module: ZoneModule
          },
          {
            path: "test",
            children: [
              {
                path: "department",
                module: DepartmentModule
              },
              {
                path: "municipality",
                module: MunicipalityModule
              }
            ]
          }
        ]
      }
    ]),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS
      }
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
  exports: [JwtModule] // <-- ¡Agrega esto!
})
export class AppModule {}
