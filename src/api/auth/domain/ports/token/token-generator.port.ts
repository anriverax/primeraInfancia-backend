import { ILoginResponse, IUser, IUserWithPermissionsResponse } from "../../../application/dto/auth.type";

export interface ITokenData {
  id: number;
  email: string;
  rolId: number;
  role: string;
}

export type AccessTokenData = ITokenData & {
  permissions: string;
};

export interface ITokenGenerator {
  setAccessToken(data: AccessTokenData): Promise<string>;

  setRefreshToken(data: ITokenData): Promise<string>;
  generateTokens(user: IUser): Promise<ILoginResponse>;
  invalidateTokens(userId: number, tokenId: string): Promise<void>;
  refreshToken(user: IUserWithPermissionsResponse, token: string): Promise<string>;
}
