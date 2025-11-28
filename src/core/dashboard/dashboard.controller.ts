import { Controller, Get, Param, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  DashboardAttendance,
  DashboardPerson,
  GetSchoolCountByDepartmentResponse,
  GetSurveyByAppendixResponse
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
import { GetAllTrainingModuleQuery } from "../catalogue/trainingModule/crqs/queries/findMany/getAllTrainingModule.query";
import { IGetAllTrainingModule } from "../catalogue/trainingModule/dto/trainingModule.type";
import { GetAllSchoolByZoneQuery } from "./cqrs/queries/school/getAllSchoolByZone.handler";
import { GetAllAppendix1Query } from "./cqrs/queries/appendix/get-all-appendix1.query";
import { GetAllAppendixQuery } from "../appendix/cqrs/queries/get-all-appendix.query";
import { GetSurveyByAppendixQuery } from "./cqrs/queries/appendix/get-survey-by-appendix.query";

@Controller()
export class DashboardController {
  constructor(
    private queryBus: QueryBus,
    private dashboardService: DashboardService
  ) {}

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
  async getDashboardMentoring(
    @Query("appendix") appendix: string
  ): Promise<GetSchoolCountByDepartmentResponse[]> {
    const completed: GetSurveyByAppendixResponse[] = [];
    const appendixs = await this.queryBus.execute(new GetAllAppendixQuery(["id", "title"]));

    for (const app of appendixs) {
      const count = await this.queryBus.execute(new GetSurveyByAppendixQuery(app.id));
      completed.push({ appendixId: app.id, title: app.title, count });
    }
    console.log("completed", completed);
    const mentoring = await this.queryBus.execute(new GetAllAppendix1Query(parseInt(appendix)));
    const result = this.dashboardService.getSchoolCountByDepartment(mentoring);

    return result;
  }
}
