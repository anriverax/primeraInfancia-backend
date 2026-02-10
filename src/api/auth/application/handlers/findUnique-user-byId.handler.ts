import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IUser } from "@/api/auth/application/dto/auth.type";
import { FindUniqueUserByIdQuery } from "../queries/findUnique-user-byId.query";
import { Inject } from "@nestjs/common";
import { IUserRepository } from "../../domain/ports/persistence/user.repository.port";

@QueryHandler(FindUniqueUserByIdQuery)
export class FindUniqueUserByIdHandler implements IQueryHandler<FindUniqueUserByIdQuery> {
  constructor(@Inject("IUserRepository") private readonly userRepository: IUserRepository) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: FindUniqueUserByIdQuery): Promise<IUser | null> {
    const where: any = {};
    const { email, id } = query;

    if (email) where.email = email;
    if (id) where.id = id;

    const user = await this.userRepository.findUnique<IUser>({
      where,
      select: {
        Role: true,
        Person: true
      }
    });

    return user || null;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
