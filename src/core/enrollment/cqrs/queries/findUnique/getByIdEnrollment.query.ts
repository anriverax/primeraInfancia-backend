import { IGetByIdEnrollment } from "@/core/enrollment/dto/enrollment.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdEnrollmentQuery extends Query<IGetByIdEnrollment> {
  constructor(public readonly id: number) {
    super();
  }
}
