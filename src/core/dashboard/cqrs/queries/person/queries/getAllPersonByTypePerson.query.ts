import { Query } from "@nestjs/cqrs";

export class GetAllPersonByTypePersonQuery extends Query<Promise<number>> {
  constructor() {
    super();
  }
}
