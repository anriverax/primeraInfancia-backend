import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DashboardController } from "./dashboard.controller";

// Import all command and query handlers here
import { GetSchoolCountsBySectorHandler } from "./queries/handlers/get-school-counts-by-sector.handler";
import { GetSchoolCountsByZoneHandler } from "./queries/handlers/get-school-counts-by-zone.handler";
import { GetSchoolCountsByGenderHandler } from "./queries/handlers/get-teacher-counts-by-gender.handler";
import { GetSchoolCountsByCareerHandler } from "./queries/handlers/get-teacher-counts-by-career.handler";
import { GetSchoolCountsByDepartmentHandler } from "./queries/handlers/get-teacher-counts-by-department.handler";

// Define an array of all query handlers for easier management
export const QueryHandlers = [
  GetSchoolCountsBySectorHandler,
  GetSchoolCountsByZoneHandler,
  GetSchoolCountsByGenderHandler,
  GetSchoolCountsByCareerHandler,
  GetSchoolCountsByDepartmentHandler
];

@Module({
  imports: [CqrsModule],
  controllers: [DashboardController],
  providers: [PrismaService, ...QueryHandlers] // Provide Prisma and the query handlers
})
export class DashboardModule {}
