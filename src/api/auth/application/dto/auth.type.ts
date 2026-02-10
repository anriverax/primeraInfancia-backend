import { Permission, Person, Role } from "prisma/generated/client";
import { User } from "prisma/generated/client";

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

export interface IUserWithPermissions extends Omit<IUser, "Role"> {
  Role: Role & { Permissions: IAuthRolePermission[] };
}

export interface IUserWithPermissionsResponse extends Omit<IUser, "Role"> {
  Role: Role & { Permissions: string[] };
}

export interface IPerson {
  firstName: string;
  lastName1: string;
  lastName2?: string;
  dui: string;
  address: string;
  gender: "M" | "H";
  phoneNumber: string;
  birthdate?: Date;
  career: string;
  nip: number;
  typePersonId: number;
  districtId: number;
  cohortId: number;
  schoolId?: number;
}

export interface IAuth {
  email: string;
  passwd: string;
  roleId: number;
}

export type IPersonCreateData = IAuth & IPerson;
