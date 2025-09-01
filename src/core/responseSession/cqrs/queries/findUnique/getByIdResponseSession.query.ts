import { IGetByIdResponseSession } from "@/core/responseSession/dto/responseSession.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdResponseSessionQuery extends Query<IGetByIdResponseSession> {
  constructor(public readonly id: number) {
    super();
  }
}
