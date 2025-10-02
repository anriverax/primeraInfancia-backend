import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export enum PermissionEnum {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  VIEW_DASHBOARD_ATTENDANCE = "VIEW_DASHBOARD_ATTENDANCE",
  VIEW_DASHBOARD_EVALUATION = "VIEW_DASHBOARD_EVALUATION",
  VIEW_DASHBOARD_MENTORING = "VIEW_DASHBOARD_MENTORING",
  VIEW_DASHBOARD_PARTICIPANTS = "VIEW_DASHBOARD_PARTICIPANTS",
  VIEW_GROUPS = "VIEW_GROUPS",
  VIEW_ATTENDANCE = "VIEW_ATTENDANCE",
  VIEW_EVALUATION = "VIEW_EVALUATION",
  VIEW_MENTORING = "VIEW_MENTORING",
  VIEW_CATALOGUES = "VIEW_CATALOGUES",
  VIEW_CATALOGUE_SCHOOL = "VIEW_CATALOGUE_SCHOOL",
  VIEW_CATALOGUE_MODULE = "VIEW_CATALOGUE_MODULE",
  VIEW_CATALOGUE_ZONE = "VIEW_CATALOGUE_ZONE"
}

export const permissionData = Object.values(PermissionEnum).map((name) => ({ name }));

const ASSIGNMENT_PERMISSIONS: Record<"A" | "M" | "F" | "T", PermissionEnum[]> = {
  A: Object.values(PermissionEnum),
  F: [PermissionEnum.VIEW_ATTENDANCE, PermissionEnum.VIEW_EVALUATION, PermissionEnum.VIEW_GROUPS],
  M: [PermissionEnum.VIEW_ATTENDANCE, PermissionEnum.VIEW_MENTORING, PermissionEnum.VIEW_GROUPS],
  T: [
    PermissionEnum.VIEW_ATTENDANCE,
    PermissionEnum.VIEW_MENTORING,
    PermissionEnum.VIEW_EVALUATION,
    PermissionEnum.VIEW_GROUPS
  ]
};

export const setPermissions = async (
  p: {
    id: number;
    name: string;
  }[],
  assignment: "A" | "M" | "F" | "T",
  roleId: number
) => {
  const allowed = ASSIGNMENT_PERMISSIONS[assignment];

  const result = assignment === "A" ? p : p.filter((p) => allowed.includes(p.name as PermissionEnum));

  await prisma.rolePermission.createMany({
    data: result.map((p) => ({
      roleId,
      isActive: true,
      permissionId: p.id
    }))
  });
};
