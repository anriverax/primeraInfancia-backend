import { IGetByIdEnrollmentMentor } from "@/core/enrollmentMentor/dto/enrollmentMentor.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdEnrollmentMentorQuery extends Query<IGetByIdEnrollmentMentor> {
  constructor(public readonly id: number) {
    super();
  }
}
