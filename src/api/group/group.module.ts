import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./presentation/group.controller";
import { DepartmentModule } from "../catalogue/department/department.module";
import { GetAllDepartmentWithGroupsHandler } from "./application/handlers/getAll-department-with-groups.handler";
import { UploadExcelHandler } from "./application/handlers/upload-excel.handler";
import { ExcelDomainService } from "./domain/services/excelDomain.service";
import { AuthModule } from "../auth/auth.module";
import { NameNormalizerService } from "./domain/services/nameNormalizerDomain.service";
import { PrismaGroupRepository } from "./infrastructure/adapters/prisma-group.repository";
import { CompareDataService } from "./infrastructure/compare-data.service";
import { PrismaTeacherRepository } from "./infrastructure/adapters/prisma-teacher.repository";
import { PrismaGroupStaffRepository } from "./infrastructure/adapters/prisma-groupStaff.repository";
import { GroupHierarchyService } from "./services/groupHierarchy.service";
import { NameParserService } from "./domain/services/nameParser.service";
import { GroupStaffProjection } from "./application/projections/groupStaff.projection";
import { UpdatePersonEventHandler } from "./application/handlers/update-person.handler";
import { UpdateGroupStaffEventHandler } from "./application/handlers/update-groupStaff.event.handler";
import { TeacherProjection } from "./application/projections/teacher.projection";
import { PrismaTypePersonRepository } from "./infrastructure/adapters/prisma-typePerson.repository";
import { UpdateTeacherEventHandler } from "./application/handlers/update-teacher.handler";
import { FindManyTeachersByUserIdHandler } from "./application/handlers/findMany-teachers-byUserId.handler";

const GroupQueryHandlers = [
  GetAllDepartmentWithGroupsHandler,
  UploadExcelHandler,
  FindManyTeachersByUserIdHandler
];
const GroupCommandHandlers = [];

const GroupProjections = [GroupStaffProjection, TeacherProjection];
const EventHandlers = [
  UpdatePersonEventHandler,
  UpdateGroupStaffEventHandler,
  UpdateTeacherEventHandler
];

const GroupProviders = [
  {
    provide: "IGroupRepository",
    useClass: PrismaGroupRepository
  },
  {
    provide: "ITeacherRepository",
    useClass: PrismaTeacherRepository
  },
  {
    provide: "ITypePersonRepository",
    useClass: PrismaTypePersonRepository
  },
  {
    provide: "IGroupStaffRepository",
    useClass: PrismaGroupStaffRepository
  }
];

@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule, DepartmentModule, AuthModule],
  controllers: [GroupController],
  providers: [
    PrismaService,
    NameNormalizerService,
    ExcelDomainService,
    NameParserService,
    CompareDataService,
    GroupHierarchyService,
    ...EventHandlers,
    ...GroupQueryHandlers,
    ...GroupCommandHandlers,
    ...GroupProviders,
    ...GroupProjections
  ],
  exports: ["IGroupStaffRepository"]
})
export class GroupModule {}
