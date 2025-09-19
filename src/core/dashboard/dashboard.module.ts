import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DashboardController } from "./dashboard.controller";
import { GetAllSchoolByZoneHandler } from "./cqrs/queries/school/handler/getAllSchoolByZone.handler";
import { GetAllSchoolByDepartmentHandler } from "./cqrs/queries/school/handler/getAllSchoolByDepartment.handler";
import { GetAllSchoolHandler } from "./cqrs/queries/school/handler/getAllSchool.handler";
import { GetAllPersonByTypePersonHandler } from "./cqrs/queries/person/handler/getAllPersonByTypePerson.handler";
import { GetAllBirthdateHandler } from "./cqrs/queries/person/handler/getAllBirthdate.handler";
import { DashboardService } from "./services/dashboard.service";
import { GetAllTeacherByCareerHandler } from "./cqrs/queries/person/handler/getAllTeacherByCareer.handler";
import { GetAllTeacherBySexHandler } from './cqrs/queries/person/handler/getAllTeacherBySex.handler';
import { GetAllTeacherByNipHandler } from './cqrs/queries/person/handler/getAllTeacherByNip.handler';

export {};
export const QueryHandlers = [
  GetAllSchoolByZoneHandler,
  GetAllSchoolByDepartmentHandler,
  GetAllSchoolHandler,
  GetAllPersonByTypePersonHandler,
  GetAllBirthdateHandler,
  GetAllTeacherByCareerHandler,
  GetAllTeacherBySexHandler,
  GetAllTeacherByNipHandler
];

@Module({
  imports: [CqrsModule],
  controllers: [DashboardController],
  providers: [PrismaService, ...QueryHandlers, DashboardService]
})
export class DashboardModule {}
