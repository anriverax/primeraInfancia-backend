import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, RouterModule } from "@nestjs/core";
import * as fs from "fs";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

// config
import config from "./config/config";
import { validate } from "./config/env.config";

// module - Services
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";

// module - Controller
import { AuthModule } from "./core/auth/auth.module";
import { CatalogueModule } from "./core/catalogue/common/catalogue.module";
import { EventModule } from "./core/catalogue/event/event.module";
import { ProfileModule } from "./core/profile/profile.module";
import { ZoneModule } from "./core/catalogue/zone/zone.module";
import { GroupModule } from "./core/group/group.module";

// test
import { DepartmentModule } from "./core/test/coutry/department/department.module";
import { MunicipalityModule } from "./core/test/coutry/municipality/municipality.module";
import { PermissionModule } from "./core/test/permission/permission.module";
import { SchoolModule } from "./core/test/school/school.module";
import { AttendanceModule } from "./core/attendance/attendance.module";
import { MentorAssignmentModule } from "./core/mentorAssignment/mentorAssignment.module";
import { HealthModule } from './core/health/health.module';

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
    HealthModule,
    AuthModule,
    CatalogueModule,
    ProfileModule,
    ZoneModule,
    GroupModule,
    DepartmentModule,
    MunicipalityModule,
    PermissionModule,
    SchoolModule,
    EventModule,
    AttendanceModule,
    MentorAssignmentModule,
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
            module: CatalogueModule,
            children: [
              {
                path: "zone",
                module: ZoneModule
              },
              {
                path: "events",
                module: EventModule
              }
            ]
          },
          {
            path: "profile",
            module: ProfileModule
          },
          {
            path: "group",
            module: GroupModule
          },
          {
            path: "attendance",
            module: AttendanceModule
          },
          {
            path: "mentorAssignment",
            module: MentorAssignmentModule
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
              },
              {
                path: "school",
                module: SchoolModule
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
