import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetRefreshTokenQuery } from "./refresh-token.query";
import { ILoginResponse } from "@/core/auth/application/dto/auth.type";
import { NotFoundException } from "@nestjs/common";
import { FindUserByIdQuery } from "../find-user/find-user-by-id.query";
import { AuthDomainService } from "../../services/authDomain.service";
import { GetRolByIdQuery } from "../get-rol/get-rol-by-id.query";

@QueryHandler(GetRefreshTokenQuery)
export class GetRefreshTokenQueryHandler implements IQueryHandler<GetRefreshTokenQuery> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService
  ) {}
  async execute(query: GetRefreshTokenQuery): Promise<ILoginResponse> {
    const { req, email } = query;

    const result = await this.queryBus.execute(new FindUserByIdQuery({ email }));
    if (!result) throw new NotFoundException("El usuario no existe en el sistema.");

    const userPermissions = await this.queryBus.execute(new GetRolByIdQuery(result.roleId));

    const accessToken = await this.authDomain.refreshTokenAndBuildLogin(req, result, userPermissions);

    return accessToken;
  }
}
