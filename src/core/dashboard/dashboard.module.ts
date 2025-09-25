import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { DashboardController } from "./dashboard.controller";
import { GetAllSchoolByZoneHandler } from "./cqrs/queries/school/handler/getAllSchoolByZone.handler";
import { GetAllSchoolByDepartmentHandler } from "./cqrs/queries/school/handler/getAllSchoolByDepartment.handler";
import { GetAllSchoolHandler } from "./cqrs/queries/school/handler/getAllSchool.handler";
import { GetAllRegisteredTeachersHandler } from "./cqrs/queries/person/handler/getAllRegisteredTeachers.handler";
import { GetAllBirthdateHandler } from "./cqrs/queries/person/handler/getAllBirthdate.handler";
import { DashboardService } from "./services/dashboard.service";
import { GetAllTeacherByCareerHandler } from "./cqrs/queries/person/handler/getAllTeacherByCareer.handler";
import { GetAllTeacherBySexHandler } from "./cqrs/queries/person/handler/getAllTeacherBySex.handler";
import { GetAllTeacherByNipHandler } from "./cqrs/queries/person/handler/getAllTeacherByNip.handler";
import { GetAllAttendanceHandler } from "./cqrs/queries/attendance/getAllAttendance.handler";
import { GetAllMentoringHandler } from "./cqrs/queries/mentoring/getAllMentoring.handler";
import { GetAllEventByTypeHandler } from "./cqrs/queries/eventType/getAllEventByType.handler";
import { GetTeacherCountsByYearsExperienceHandler } from "./cqrs/queries/person/handler/getTeacherCountByYearsExperience.handler";
import { GetTeacherCountByEducationalLevelHandler } from "./cqrs/queries/person/handler/getTeacherCountByEducationalLevel.handler";
import { GetAppendix8Handler } from "./cqrs/queries/appendix/handler/getAppendix8.handler";

export const QueryHandlers = [
  GetAllSchoolByZoneHandler,
  GetAllSchoolByDepartmentHandler,
  GetAllSchoolHandler,
  GetAllRegisteredTeachersHandler,
  GetAllBirthdateHandler,
  GetAllTeacherByCareerHandler,
  GetAllTeacherBySexHandler,
  GetAllTeacherByNipHandler,
  GetAllAttendanceHandler,
  GetAllMentoringHandler,
  GetAllEventByTypeHandler,
  GetTeacherCountsByYearsExperienceHandler,
  GetTeacherCountByEducationalLevelHandler,
  GetAppendix8Handler
];

@Module({
  imports: [CqrsModule],
  controllers: [DashboardController],
  providers: [PrismaService, ...QueryHandlers, DashboardService]
})
export class DashboardModule {}
