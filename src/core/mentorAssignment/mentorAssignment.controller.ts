import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Req, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { FindByUserIdQuery } from "./cqrs/queries/findByUserId.query";
import { MentorAssignmentService } from "./services/mentorAssignment.service";

@Controller()
@UseFilters(HttpExceptionFilter)
export class MentorAssignmentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mentorAssignmentService: MentorAssignmentService
  ) {}

  @AuthRequired()
  @Get("user")
  async findMentorsByUserId(@Req() req: Request) {
    const userId = req["user"].sub;

    const result = await this.queryBus.execute(new FindByUserIdQuery(parseInt(userId)));
    const data = this.mentorAssignmentService.order(result);
    return data;
  }
}
