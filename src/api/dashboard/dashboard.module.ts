import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { DashboardController } from "./presentation/dashboard.controller";
import { SchoolModule } from "../catalogue/school/school.module";
import { GetAllSchoolHandler } from "./application/handlers/getAll-school.handler";

const DashboardQueryHandlers = [GetAllSchoolHandler];
const DashboardCommandHandlers = [];

@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule, SchoolModule],
  controllers: [DashboardController],
  providers: [PrismaService, ...DashboardQueryHandlers, ...DashboardCommandHandlers]
})
export class DashboardModule {}
