import { Query } from "@nestjs/cqrs";

export class GetAllSchoolByDepartmentQuery extends Query<
  Promise<{ department: string; school: number; teacher: number }[]>
> {
  constructor() {
    super();
  }
}
