import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, RouterModule } from "@nestjs/core";
import * as fs from "fs";

import config from "./config/config";
import { validate } from "./config/env.config";

// module
import { AuthModule } from "./core/auth/auth.module";
import { CatalogueModule } from "./core/catalogue/catalogue.module";
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ProfileModule } from "./core/profile/profile.module";
import { ZoneModule } from "./core/zone/zone.module";
import { GroupModule } from "./core/group/group.module";
import { SchoolModule } from "./core/school/school.module";
// test
import { DepartmentModule } from "./core/test/coutry/department/department.module";
import { MunicipalityModule } from "./core/test/coutry/municipality/municipality.module";
import { PermissionModule } from "./core/test/permission/permission.module";
import { PersonModule } from "./core/person/person.module";

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
    CatalogueModule,
    ProfileModule,
    ZoneModule,
    GroupModule,
    SchoolModule,
    PersonModule,
    DepartmentModule,
    MunicipalityModule,
    PermissionModule,
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
            path: "group",
            module: GroupModule
          },
          {
            path: "school",
            module: SchoolModule
          },
          {
            path: "person",
            module: PersonModule
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
              },
              {
                path: "permission",
                module: PermissionModule
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
