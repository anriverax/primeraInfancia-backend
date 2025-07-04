import {
  Academic,
  Menu,
  MenuPermission,
  PermissionType,
  Person,
  Role,
  RolePermission,
  User,
  UserKey
} from "@prisma/client";
export type IAuth = Pick<
  Person,
  | "firstName"
  | "lastName1"
  | "lastName2"
  | "dui"
  | "address"
  | "gender"
  | "phoneNumber"
  | "birthdate"
  | "districtId"
  | "typePersonId"
> &
  Pick<Academic, "career" | "nip"> &
  Pick<User, "email" | "passwd" | "roleId">;

export type IAuthEvent = IAuth & Pick<User, "isVerified"> & Pick<UserKey, "publicKey" | "privateKey">;

export interface IUser extends User {
  Role: Role;
  Person?: Person;
}

export interface ILogin extends Pick<IUser, "email" | "isVerified"> {
  picture: string | null;
  name?: string;
  role: string;
}
export interface IPermission extends Menu {
  action: PermissionType;
}
export interface IPermissionResponse {
  menu: IPermission;
}
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ILogin;
}

export interface ILoginPermissionResponse extends ILoginResponse {
  permissions: IPermissionResponse[];
}
export type IToken = Pick<IUser, "email"> & Pick<ILoginResponse, "accessToken">;

export interface IPayload extends Pick<ILogin, "email" | "role"> {
  sub: number;
  iat: number;
  exp: number;
}

export type IUserKeyCreate = Pick<UserKey, "userId" | "publicKey" | "privateKey">;

export interface IChangePasswd extends Pick<IUser, "id" | "email"> {
  oldPasswd: string;
  newPasswd: string;
}

export type IFindUserByParams = Partial<Pick<IUser, "id" | "email">>;

export interface IUpdatePasswdIsVerifiedParams extends Pick<IUser, "id" | "email"> {
  data: Partial<Pick<IUser, "passwd" | "isVerified">>;
}

export interface IVerifyEmail extends Pick<IUser, "id" | "email"> {
  verifyCode: string;
}

export interface IGetAllMenuPermission extends MenuPermission {
  Menu: Menu;
  PermissionType: PermissionType;
}
export interface IGetAllRolePermission extends RolePermission {
  MenuPermission: IGetAllMenuPermission;
}
