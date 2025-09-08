import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MentorAssignmentController } from "./mentorAssignment.controller";
import { Module } from "@nestjs/common";
import { FindByUserIdHandler } from "./cqrs/queries/findByUser.handler";
import { MentorAssignmentService } from "./services/mentorAssignment.service";

const QueryHandlers = [FindByUserIdHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [MentorAssignmentController],
  providers: [...QueryHandlers, MentorAssignmentService]
})
export class MentorAssignmentModule {}
