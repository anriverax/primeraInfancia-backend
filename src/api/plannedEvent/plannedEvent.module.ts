import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { PlannedEventController } from "./presentation/plannedEvent.controller";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTrainingModulesHandler } from "./application/handlers/getAll-trainingModule.handler";
import { FindManyEventInstanceHandler } from "./application/handlers/findMany-eventInstance.handler";
import { CreatePlannedEventHandler } from "./application/handlers/create-plannedEvent.handler";
import { PlannedEventProjection } from "./application/projections/plannedEvent.projection";
import { PrismaPlannedEventRepository } from "./infrastructure/prisma-plannedEvent.repository";
import { PrismaPlannedEventTeacherRepository } from "./infrastructure/prisma-plannedEventTeacher.repository";
import { CreatePlannedEventTeacherHandler } from "./application/handlers/create-plannedEventTeacher.handler";
import { PlannedEventTeacherProjection } from "./application/projections/plannedEventTeacher.projection";
import { PrismaTrainingModuleRepository } from "@/core/trainingModule/infrastructure/prisma-trainingModule.repository";
import { PrismaEventInstanceRepository } from "@/core/event/infrastructure/prisma-eventInstance.repository";
import { GetAllPlannedEventHandler } from "./application/handlers/getAll-plannedEvent.handler";
import { FindManyTeachersByPersonHandler } from "./application/handlers/findMany-teachers-byPerson.handler";
import { FindUniquePlannedEventByIdHandler } from "./application/handlers/findUnique-plannedEvent-byId.handler";
import { UpdatePlannedEventHandler } from "./application/handlers/update-plannedEvent.handler";
import { PlannedEventDomainService } from "./domain/services/plannedEventDomain.services";
import { GroupModule } from "../group/group.module";

const PlannedEventQueryHandlers = [
  GetAllTrainingModulesHandler,
  FindManyEventInstanceHandler,
  GetAllPlannedEventHandler,
  FindManyTeachersByPersonHandler,
  FindUniquePlannedEventByIdHandler
];

const PlannedEventCommandHandlers = [
  CreatePlannedEventHandler,
  UpdatePlannedEventHandler,
  CreatePlannedEventTeacherHandler
];
const ProjectionProviders = [PlannedEventProjection, PlannedEventTeacherProjection];

const PortProviders = [
  {
    provide: "ITrainingModuleRepository",
    useClass: PrismaTrainingModuleRepository
  },
  {
    provide: "IEventInstanceRepository",
    useClass: PrismaEventInstanceRepository
  },
  {
    provide: "IPlannedEventRepository",
    useClass: PrismaPlannedEventRepository
  },
  {
    provide: "IPlannedEventTeacherRepository",
    useClass: PrismaPlannedEventTeacherRepository
  }
];

@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule, GroupModule],
  controllers: [PlannedEventController],
  providers: [
    PrismaService,
    PlannedEventDomainService,
    ...PortProviders,
    ...ProjectionProviders,
    ...PlannedEventQueryHandlers,
    ...PlannedEventCommandHandlers
  ]
})
export class PlannedEventModule {}
