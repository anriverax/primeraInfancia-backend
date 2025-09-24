import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DashboardController } from "./dashboard.controller";

// Import all command and query handlers here
import { GetSchoolCountsBySectorHandler } from "./queries/handlers/get-school-counts-by-sector.handler";
import { GetSchoolCountsByZoneHandler } from "./queries/handlers/get-school-counts-by-zone.handler";
import { GetSchoolCountsByDepartmentHandler } from "./queries/handlers/get-school-counts-by-department.handler";
import { GetTeacherCountsByGenderHandler } from "./queries/handlers/get-teacher-counts-by-gender.handler";
import { GetTeacherCountByCareerHandler } from "./queries/handlers/get-teacher-counts-by-career.handler";
import { GetTeacherCountByDepartmentHandler } from "./queries/handlers/get-teacher-counts-by-department.handler";
import { GetAppendix8Handler } from "./queries/handlers/get-appendix8.handler";
import { GetTeacherCountsByYearsExperienceHandler } from "./queries/handlers/get-teacher-counts-by-years-experience.handler";
import { GetTeacherCountsByAgeChildrenHandler } from "./queries/handlers/get-teacher-counts-by-age-children.handler";

// Define an array of all query handlers for easier management
export const QueryHandlers = [
  GetSchoolCountsBySectorHandler,
  GetSchoolCountsByZoneHandler,
  GetSchoolCountsByDepartmentHandler,
  GetTeacherCountsByGenderHandler,
  GetTeacherCountByCareerHandler,
  GetTeacherCountByDepartmentHandler,
  GetAppendix8Handler,
  GetTeacherCountsByYearsExperienceHandler,
  GetTeacherCountsByAgeChildrenHandler
];

@Module({
  imports: [CqrsModule],
  controllers: [DashboardController],
  providers: [PrismaService, ...QueryHandlers] // Provide Prisma and the query handlers
})
export class DashboardModule { }
