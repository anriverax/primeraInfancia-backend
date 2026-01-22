import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetRefreshTokenQuery } from "./refresh-token.query";
import { ILoginResponse } from "@/core/auth/dto/auth.type";
import { TokenService } from "@/core/auth/services/token.service";
import { NotFoundException } from "@nestjs/common";
import { FindUniqueUserQuery } from "../user/find-unique-user.handler";
import { GetByRolIdQuery } from "../role/get-by-rol-id.query";
import { AuthService } from "@/core/auth/services/auth.service";

@QueryHandler(GetRefreshTokenQuery)
export class GetRefreshTokenQueryHandler implements IQueryHandler<GetRefreshTokenQuery> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService
  ) {}
  async execute(query: GetRefreshTokenQuery): Promise<ILoginResponse> {
    const { req, email } = query;
    const accessToken = await this.tokenService.refreshToken(req);

    const result = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (!result) throw new NotFoundException("El usuario no existe en el sistema.");

    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(result.roleId));

    const data = this.authService.getData(accessToken, req["token"], result, userPermissions);

    return data;
  }
}
