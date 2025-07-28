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
import { ProfileModule } from "./core/profile/profile.module";
import { ZoneModule } from "./core/catalogue/zone/zone.module";
import { GroupModule } from "./core/group/group.module";
import { TrainingModuleModule } from "./core/trainingModule/trainingModule.module";
import { EvaluationInstrumentModule } from "./core/evaluationInstrument/evaluationInstrument.module";
import { PersonRoleModule } from "./core/personRole/personRole.module";
import { GroupTrainerModule } from "./core/groupTrainer/groupTrainer.module";
import { EnrollmentMentorModule } from "./core/enrollmentMentor/enrollmentMentor.module";
import { EnrollmentModule } from "./core/enrollment/enrollment.module";

// test
import { DepartmentModule } from "./core/test/coutry/department/department.module";
import { MunicipalityModule } from "./core/test/coutry/municipality/municipality.module";
import { PermissionModule } from "./core/test/permission/permission.module";

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
    TrainingModuleModule,
    EvaluationInstrumentModule,
    PersonRoleModule,
    GroupTrainerModule,
    EnrollmentMentorModule,
    EnrollmentModule,
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
            module: CatalogueModule,
            children: [
              {
                path: "zone",
                module: ZoneModule
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
            path: "trainingModule",
            module: TrainingModuleModule
          },
          {
            path: "evaluationInstrument",
            module: EvaluationInstrumentModule
          },
          {
            path: "personRole",
            module: PersonRoleModule
          },
          {
            path: "groupTrainer",
            module: GroupTrainerModule
          },
          {
            path: "enrollmentMentor",
            module: EnrollmentMentorModule
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
export class AppModule { }
