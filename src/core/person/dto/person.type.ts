import { Person } from "@prisma/client";

// export type ICreatePerson = Pick<
//   Person,
//   | "firstName"
//   | "lastName1"
//   | "lastName2"
//   | "dui"
//   | "address"
//   | "gender"
//   | "phoneNumber"
//   | "birthdate"
//   | "duiImage"
//   | "districtId"
//   | "isActive"
//   | "typePersonId"
// >;
// export type IUpdatePerson = Pick<
//   Person,
//   | "id"
//   | "firstName"
//   | "lastName1"
//   | "lastName2"
//   | "dui"
//   | "address"
//   | "gender"
//   | "phoneNumber"
//   | "birthdate"
//   | "duiImage"
//   | "districtId"
//   | "isActive"
//   | "typePersonId"
//   | "updatedBy"
// >;
// export type IDeletePerson = Pick<Person, "id" | "deletedBy">;
export type IGetPerson = Pick<
  Person,
  | "id"
  | "firstName"
  | "lastName1"
  | "lastName2"
  | "dui"
  | "address"
  | "gender"
  | "phoneNumber"
  | "birthdate"
  | "duiImage"
  | "districtId"
  | "isActive"
  | "typePersonId"
>;
