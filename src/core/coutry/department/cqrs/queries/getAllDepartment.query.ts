import { Query } from "@nestjs/cqrs";
import { IDepartmentWithInclude } from "../../dto/department.type";

export class GetAllDepartmentQuery extends Query<IDepartmentWithInclude[]> {
  constructor() {
    super();
  }
}
