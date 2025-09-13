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

// test
import { DepartmentModule } from "./core/test/coutry/department/department.module";
import { MunicipalityModule } from "./core/test/coutry/municipality/municipality.module";
import { PermissionModule } from "./core/test/permission/permission.module";
import { SchoolModule } from "./core/test/school/school.module";

//Evaluation and grades
import { TrainingModuleModule } from "./core/trainingModule/trainingModule.module";
import { ModuleReportModule } from "./core/moduleReport/moduleReport.module";
import { TrainingReportModule } from "./core/trainingReport/trainingReport.module";
import { TrainingEvaluationModule } from "./core/trainingEvaluation/trainingEvaluation.module";
import { EvaluationInstrumentModule } from "./core/evaluationInstrument/evaluationInstrument.module";
import { ModuleEvaluationModule } from "./core/moduleEvaluation/moduleEvaluation.module";
import { InscriptionModule } from "./core/inscription/inscription.module";

//Attachment
import { InstrumentModule } from "./core/instrument/instrument.module";
import { SectionModule } from "./core/section/section.module";
import { QuestionModule } from "./core/question/question.module";
import { OptionModule } from "./core/option/option.module";
import { ResponseSelectionOptionModule } from "./core/responseSelectionOption/responseSelectionOption.module";
import { AnswerModule } from "./core/answer/answer.module";
import { ResponseSessionModule } from "./core/responseSession/responseSession.module";
import { TrackingTypeModule } from "./core/trackingType/trackingType.module";
import { TrackingModule } from "./core/tracking/tracking.module";

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
    DepartmentModule,
    MunicipalityModule,
    PermissionModule,
    SchoolModule,
    TrainingModuleModule,
    ModuleReportModule,
    TrainingReportModule,
    TrainingEvaluationModule,
    EvaluationInstrumentModule,
    ModuleEvaluationModule,
    InscriptionModule,
    InstrumentModule,
    SectionModule,
    QuestionModule,
    OptionModule,
    ResponseSelectionOptionModule,
    AnswerModule,
    ResponseSessionModule,
    TrackingTypeModule,
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
            path: "training-module",
            module: TrainingModuleModule
          },
          {
            path: "module-report",
            module: ModuleReportModule
          },
          {
            path: "training-report",
            module: TrainingReportModule
          },
          {
            path: "training-evaluation",
            module: TrainingEvaluationModule
          },
          {
            path: "evaluation-instrument",
            module: EvaluationInstrumentModule
          },
          {
            path: "module-evaluation",
            module: ModuleEvaluationModule
          },
          {
            path: "inscription",
            module: InscriptionModule
          },
          {
            path: "instrument",
            module: InstrumentModule
          },
          {
            path: "section",
            module: SectionModule
          },
          {
            path: "question",
            module: QuestionModule
          },
          {
            path: "option",
            module: OptionModule
          },
          {
            path: "response-selection-option",
            module: ResponseSelectionOptionModule
          },
          {
            path: "answer",
            module: AnswerModule
          },
          {
            path: "response-session",
            module: ResponseSessionModule
          },
          {
            path: "tracking-type",
            module: TrackingTypeModule
          },
          {
            path: "tracking",
            module: TrackingModule
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
export class AppModule { }
