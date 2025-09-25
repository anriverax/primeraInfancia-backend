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
  VIEW_MENTORING = "VIEW_MENTORING",
  VIEW_EVALUATION = "VIEW_EVALUATION",
  VIEW_CATALOGUES = "VIEW_CATALOGUES",
  VIEW_CATALOGUE_SCHOOL = "VIEW_CATALOGUE_SCHOOL",
  VIEW_CATALOGUE_MODULE = "VIEW_CATALOGUE_MODULE",
  VIEW_CATALOGUE_ZONE = "VIEW_CATALOGUE_ZONE"
}

export const permissionData = [
  {
    name: PermissionEnum.VIEW_DASHBOARD
  },
  {
    name: PermissionEnum.VIEW_DASHBOARD_ATTENDANCE
  },
  {
    name: PermissionEnum.VIEW_DASHBOARD_EVALUATION
  },
  {
    name: PermissionEnum.VIEW_DASHBOARD_MENTORING
  },
  {
    name: PermissionEnum.VIEW_DASHBOARD_PARTICIPANTS
  },
  { name: PermissionEnum.VIEW_GROUPS },
  { name: PermissionEnum.VIEW_ATTENDANCE },
  { name: PermissionEnum.VIEW_MENTORING },
  { name: PermissionEnum.VIEW_CATALOGUES },
  { name: PermissionEnum.VIEW_CATALOGUE_SCHOOL },
  { name: PermissionEnum.VIEW_CATALOGUE_MODULE },
  { name: PermissionEnum.VIEW_CATALOGUE_ZONE }
];

export const setPermissions = async (
  p: {
    id: number;
    name: string;
  }[],
  assignment: "A" | "M" | "F" | "T",
  id: number
) => {
  let result: {
    id: number;
    name: string;
  }[] = [];

  if (assignment === "F") {
    result = p.filter((p) =>
      [
        PermissionEnum.VIEW_ATTENDANCE,
        PermissionEnum.VIEW_EVALUATION,
        PermissionEnum.VIEW_GROUPS
      ].includes(p.name as PermissionEnum)
    );
  } else if (assignment === "M") {
    result = p.filter((p) =>
      [PermissionEnum.VIEW_ATTENDANCE, PermissionEnum.VIEW_MENTORING].includes(p.name as PermissionEnum)
    );
  } else if (assignment === "T") {
    result = p.filter((p) =>
      [
        PermissionEnum.VIEW_ATTENDANCE,
        PermissionEnum.VIEW_MENTORING,
        PermissionEnum.VIEW_EVALUATION,
        PermissionEnum.VIEW_GROUPS
      ].includes(p.name as PermissionEnum)
    );
  } else result = p;

  await prisma.rolePermission.createMany({
    data: result.map((p) => ({
      roleId: id,
      isActive: true,
      permissionId: p.id
    }))
  });
};
