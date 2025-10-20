import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR, RouterModule } from "@nestjs/core";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

// config
import config from "./config/config";

// module - Services
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";

// module - Controller
import { AuthModule } from "./core/auth/auth.module";
import { CatalogueModule } from "./core/catalogue/common/catalogue.module";
import { ProfileModule } from "./core/profile/profile.module";
import { ZoneModule } from "./core/catalogue/zone/zone.module";
import { GroupModule } from "./core/group/group.module";

// test
import { DepartmentModule } from "./core/test/coutry/department/department.module";
import { MunicipalityModule } from "./core/test/coutry/municipality/municipality.module";
import { PermissionModule } from "./core/test/permission/permission.module";
import { AttendanceModule } from "./core/attendance/attendance.module";
import { HealthModule } from "./core/health/health.module";
import { TrainingModule } from "./core/catalogue/trainingModule/trainingModule.module";
import { EvaluationInstrumentModule } from "./core/catalogue/evaluationInstrument/evaluationInstrument.module";
import { SchoolModule } from "./core/catalogue/school/school.module";
import { DashboardModule } from "./core/dashboard/dashboard.module";
import { TechsupportModule } from "./core/test/techsupport/techsupport.module";

// Appendix
import { AppendixModule } from "./core/appendix/appendix.module";
import { AnswerModule } from "./core/answer/answer.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        global: true,
        privateKey: process.env.JWT_PRIVATE_KEY,
        publicKey: process.env.JWT_PUBLIC_KEY,
        signOptions: {
          algorithm: "RS256",
          expiresIn: "15m"
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
    AttendanceModule,
    TrainingModule,
    EvaluationInstrumentModule,
    DashboardModule,
    TechsupportModule,
    AppendixModule,
    AnswerModule,
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
                path: "cargar-data",
                module: TechsupportModule
              },
              {
                path: "zone",
                module: ZoneModule
              },
              {
                path: "trainingModule",
                module: TrainingModule
              },
              {
                path: "evaluationInstrument",
                module: EvaluationInstrumentModule
              },
              {
                path: "school",
                module: SchoolModule
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
            path: "dashboard",
            module: DashboardModule
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
          },
          {
            path: "appendix",
            module: AppendixModule
          },
          {
            path: "answer",
            module: AnswerModule
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
