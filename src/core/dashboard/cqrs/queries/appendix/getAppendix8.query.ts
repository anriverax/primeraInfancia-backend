import { IAppendix8 } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAppendix8Query extends Query<Promise<IAppendix8[]>> {
  constructor() {
    super();
  }
}
