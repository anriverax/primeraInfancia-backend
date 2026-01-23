import { Permission, Person, Role } from "prisma/generated/client";
import { User } from "prisma/generated/client";

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
> &
  Pick<Person, "typePersonId" | "career" | "nip"> &
  Pick<User, "email" | "passwd" | "roleId"> & {
    schoolId?: number;
  };

export interface IUser extends User {
  Role: Role;
  Person?: Person;
}

export interface ILogin extends Pick<IUser, "email" | "isVerified"> {
  picture: string | null;
  name?: string;
  role: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ILogin;
  permissions: string[];
}

export type IAuthPermission = Pick<Permission, "name">;

export interface IAuthRolePermission {
  Permission: IAuthPermission | null;
}

export interface IGetAllAuthRolePermission {
  Permissions: IAuthRolePermission[];
}
