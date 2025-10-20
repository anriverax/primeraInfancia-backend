import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import {GradeController} from "@/core/grade/grade.controller";
import {GradeService} from "@/core/grade/services/grade.service";
import {GetAllGradesPaginationHandler} from "@/core/grade/queries/get-all-grades-pagination";

const CommandHandlers = [];

@Module({
    imports: [CqrsModule, JwtModule],
    controllers: [GradeController],
    providers: [...CommandHandlers, GetAllGradesPaginationHandler, GradeService]
})
export class GradeModule {}
