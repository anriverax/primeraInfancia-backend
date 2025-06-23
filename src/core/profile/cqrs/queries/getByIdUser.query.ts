import { Query } from "@nestjs/cqrs";
import { IUploadProfile } from "../../dto/profile.type";

export class GetByIdUserQuery extends Query<IUploadProfile | null> {
  constructor(public readonly id: number) {
    super();
  }
}
