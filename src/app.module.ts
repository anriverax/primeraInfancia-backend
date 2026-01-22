import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

// config
import config from "./config/config";

// module - Services
import { PrismaModule } from "./services/prisma/prisma.module";
import { RedisModule } from "./services/redis/redis.module";

// module - Container modules
import { CoreContainerModule } from "./core/core-container.module";
import { CatalogueContainerModule } from "./core/catalogue/catalogue-container.module";
import { AttendanceModule } from "./core/attendance/attendance.module";
import { DashboardModule } from "./core/dashboard/dashboard.module";
import { TestContainerModule } from "./core/test/test-container.module";
import { DataContainerModule } from "./core/data-container.module";

// module - Health check
import { HealthModule } from "./core/health/health.module";
import { AuthModule } from "./core/auth/auth.module";
import { ErrorHandlingModule } from './services/errorHandling/errorHandling.module';

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
    // Health check
    HealthModule,
    // Container modules
    CoreContainerModule,
    CatalogueContainerModule,
    AttendanceModule,
    DashboardModule,
    TestContainerModule,
    DataContainerModule
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
