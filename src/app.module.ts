import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

// config
import config from "./config/config";

// module - Services
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";

// module - Health check
import { AuthModule } from "./api/auth/auth.module";
import { ErrorHandlingModule } from "./services/errorHandling/errorHandling.module";
import { CatalogueModule } from "./api/catalogue/catalogue.module";
import { PlannedEventModule } from "./api/plannedEvent/plannedEvent.module";
import { GroupModule } from "./api/group/group.module";
import { DashboardModule } from "./api/dashboard/dashboard.module";
import { AttendanceModule } from "./temp/attendance/attendance.module";
import { MenuPermissionModule } from "./temp/menuPermission/menuPermissio.module";
import { AppendixModule } from "./temp/appendix/appendix.module";
import { SurveyDataModule } from "./temp/surveyData/surveyData.module";
import { HealthModule } from "./temp/health/health.module";

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
    // Services
    ErrorHandlingModule,
    PrismaModule,
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS
      }
    }),
    AuthModule,
    DashboardModule,
    MenuPermissionModule,
    AttendanceModule,
    GroupModule,
    PlannedEventModule,
    HealthModule,
    CatalogueModule,
    AppendixModule,
    SurveyDataModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
  exports: [JwtModule]
})
export class AppModule {}
