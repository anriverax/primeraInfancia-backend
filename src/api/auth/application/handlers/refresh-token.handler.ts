import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetRefreshTokenQuery } from "../queries/refresh-token.query";
import { ILoginResponse } from "@/api/auth/application/dto/auth.type";
import { NotFoundException } from "@nestjs/common";
import { AuthDomainService } from "@/api/auth/domain/services/authDomain.service";
import { FindUniqueRolByEmailQuery } from "../queries/findUnique-rol-byEmail.query";

@QueryHandler(GetRefreshTokenQuery)
export class GetRefreshTokenHandler implements IQueryHandler<GetRefreshTokenQuery> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService
  ) {}
  async execute(query: GetRefreshTokenQuery): Promise<ILoginResponse> {
    const { token, email } = query;

    const user = await this.queryBus.execute(new FindUniqueRolByEmailQuery(email));

    if (!user) throw new NotFoundException("El usuario no existe en el sistema.");

    const accessToken = await this.authDomain.refreshTokenAndBuildLogin(token, user);

    return accessToken;
  }
}
