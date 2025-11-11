import { Department } from "@prisma/client";

/**
 * Input shape used to create a Department.
 * Contains only fields accepted from clients. Persisted `countryId` is set server-side.
 */
export type DepartmentCreateInput = Pick<Department, "name" | "geonameId" | "zoneId">;

/**
 * Lightweight projection for listing Departments.
 */
export type DepartmentList = Pick<Department, "id" | "name">;
