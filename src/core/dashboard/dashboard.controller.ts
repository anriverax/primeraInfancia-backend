import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllSchoolByZoneQuery } from "./cqrs/queries/school/queries/getAllSchoolByZone.query";
import {
  DashboardAttendance,
  DashboardMentoring,
  DashboardPerson,
  IDashboardResume,
  IAppendixAnswerCount,
  DashboardDetailMentoring
} from "./dto/dashboard.type";
import { GetAllSchoolByDepartmentQuery } from "./cqrs/queries/school/queries/getAllSchoolByDepartment.query";
import { GetAllRegisteredTeachersQuery } from "./cqrs/queries/person/queries/getAllRegisteredTeachers.query";
import { DashboardService } from "./services/dashboard.service";
import { GetAllBirthdateQuery } from "./cqrs/queries/person/queries/getAllBirthdate.query";
import { GetAllTeacherByCareerQuery } from "./cqrs/queries/person/queries/getAllTeacherByCareer.query";
import { GetAllTeacherBySexQuery } from "./cqrs/queries/person/queries/getAllTeacherBySex.query";
import { GetAllTeacherByNipQuery } from "./cqrs/queries/person/queries/getAllTeacherByNip.query";
import { GetAllAttendanceQuery } from "./cqrs/queries/attendance/getAllAttendance.query";
import { GetAllMentoringQuery } from "./cqrs/queries/mentoring/getAllMentoring.query";
import { GetAllEventByTypeQuery } from "./cqrs/queries/eventType/getAllEventByType.query";
import { GetTeacherCountByYearExperienceQuery } from "./cqrs/queries/person/queries/getTeacherCountByYearExperiencie.query";
import { GetTeacherCountByEducationalLevelQuery } from "./cqrs/queries/person/queries/getTeacherCountByEducationalLevel ";
import { GetAppendix8Query } from "./cqrs/queries/appendix/queries/getAppendix8.query";
import { GetAppendixResumeQuery } from "./cqrs/queries/appendix/queries/getAppendixResume.query";
import { GetAllTrainingModuleQuery } from "../catalogue/trainingModule/crqs/queries/findMany/getAllTrainingModule.query";
import { IGetAllTrainingModule } from "../catalogue/trainingModule/dto/trainingModule.type";
import { GetAppendixCountQuery } from "./cqrs/queries/appendix/queries/getAppendixCount.query";
import { GetAspectPracticeCountQuery } from "./cqrs/queries/appendix/queries/getAspectPracticeCount.query";

@Controller()
export class DashboardController {
  constructor(
    private queryBus: QueryBus,
    private dashboardService: DashboardService
  ) { }

  @Get("/participant")
  async getDashboardData(): Promise<DashboardPerson> {
    const schoolsByZone = await this.queryBus.execute(new GetAllSchoolByZoneQuery());
    const schoolsByDepartment = await this.queryBus.execute(new GetAllSchoolByDepartmentQuery());
    const allPerson = await this.queryBus.execute(new GetAllRegisteredTeachersQuery());
    const getAllAges = await this.queryBus.execute(new GetAllBirthdateQuery());
    const teachersByCareer = await this.queryBus.execute(new GetAllTeacherByCareerQuery());
    const teachersBySex = await this.queryBus.execute(new GetAllTeacherBySexQuery());
    const teachersByNip = await this.queryBus.execute(new GetAllTeacherByNipQuery());
    const educationalLevel = await this.queryBus.execute(new GetTeacherCountByEducationalLevelQuery());

    const teachersByYearsExperience = await this.queryBus.execute(
      new GetTeacherCountByYearExperienceQuery()
    );

    const ages = this.dashboardService.calculateAge(getAllAges);

    return {
      zone: schoolsByZone,
      department: schoolsByDepartment,
      career: teachersByCareer,
      sex: teachersBySex,
      nip: teachersByNip,
      ages,
      experience: teachersByYearsExperience,
      educationalLevel,
      totalTeacher: allPerson
    };
  }

  @Get("/attendance/:status")
  async getDashboardAttendance(@Param("status") status: string): Promise<DashboardAttendance> {
    const attendances = await this.queryBus.execute(new GetAllAttendanceQuery(status.toUpperCase()));
    const mentoring = await this.queryBus.execute(new GetAllMentoringQuery(status.toUpperCase()));
    const events = await this.queryBus.execute(new GetAllEventByTypeQuery());
    const trainingModule = await this.queryBus.execute(new GetAllTrainingModuleQuery());

    const result = trainingModule.map((module: IGetAllTrainingModule) => ({
      id: module.id,
      name: module.name
    }));

    return { eventType: attendances, trainingModule: result, mentoring, events };
  }

  @Get("/mentoring")
  async getDashboardMentoring(): Promise<DashboardMentoring> {
    const appendix8 = await this.queryBus.execute(new GetAppendix8Query());

    return { appendix8 };
  }

  @Get("resume")
  async getDashboardResume(): Promise<IDashboardResume> {
    const query = await this.queryBus.execute(new GetAppendixResumeQuery());

    return query;
  }

  @Get("answer-counts")
  async getAppendixAnswerCounts(): Promise<IAppendixAnswerCount> {
    const query = this.queryBus.execute(new GetAppendixCountQuery());

    return query;
  }

  @Get("est")
  async getDashboardResume2(): Promise<DashboardDetailMentoring> {
    const resume = await this.queryBus.execute(new GetAppendixResumeQuery());
    const answerCounts = await this.queryBus.execute(new GetAppendixCountQuery());
    const aspectPracticeCounts = await this.queryBus.execute(new GetAspectPracticeCountQuery());

    return {
      dashboardResume: resume,
      appendixAnswerCount: answerCounts,
      aspectPracticeCount: aspectPracticeCounts
    };
  }
}
