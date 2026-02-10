import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { CqrsModule } from "@nestjs/cqrs";
import { Module } from "@nestjs/common";
import { PrismaSchoolRepository } from "./infrastructure/prisma-school.repository";

const SchoolQueryHandlers = [];

const SchoolPortProviders = [
  {
    provide: "ISchoolRepository",
    useClass: PrismaSchoolRepository
  }
];

@Module({
  imports: [CqrsModule, ErrorHandlingModule],
  providers: [...SchoolPortProviders, ...SchoolQueryHandlers],
  exports: ["ISchoolRepository"]
})
export class SchoolModule {}
