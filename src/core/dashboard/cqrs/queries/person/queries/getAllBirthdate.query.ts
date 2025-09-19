import { Query } from "@nestjs/cqrs";

export class GetAllBirthdateQuery extends Query<Promise<{ birthdate: string | null }[]>> {
  constructor() {
    super();
  }
}
