import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { PrismaDepartmentRepository } from "./infrastructure/prisma-department.respository";
import { CqrsModule } from "@nestjs/cqrs";
import { Module } from "@nestjs/common";

const DepartmentQueryHandlers = [];

const DepartmentPortProviders = [
  {
    provide: "IDepartmentRepository",
    useClass: PrismaDepartmentRepository
  }
];

@Module({
  imports: [CqrsModule, ErrorHandlingModule],
  providers: [...DepartmentPortProviders, ...DepartmentQueryHandlers],
  exports: ["IDepartmentRepository"]
})
export class DepartmentModule {}
