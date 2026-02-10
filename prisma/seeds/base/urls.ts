import { PermissionEnum } from "./permissions";

export const menuJson = {
  dashboard: "/admin/dashboard",
  asistenciaDashboard: "/admin/dashboard/asistencia",
  evaluacionDashboard: "/admin/dashboard/evaluacion",
  mentoriaDashboard: "/admin/dashboard/mentoria",
  participantesDashboard: "/admin/dashboard/participantes",
  grupos: "/admin/grupos",
  asistencia: "/admin/asistencia",
  calificaciones: "/admin/calificaciones",
  mentoria: "/admin/mentoria",
  catalogos: "/admin/catalogo",
  centrosEscolares: "/admin/catalogo/centros-educativos",
  modulos: "/admin/catalogo/modulos-formativos",
  zonas: "/admin/catalogo/zonas"
} as const;

type MenuPath = (typeof menuJson)[keyof typeof menuJson];

export const menuPermissionMap: Record<MenuPath, PermissionEnum> = {
  [menuJson.dashboard]: PermissionEnum.VIEW_DASHBOARD,
  [menuJson.asistenciaDashboard]: PermissionEnum.VIEW_DASHBOARD_ATTENDANCE,
  [menuJson.evaluacionDashboard]: PermissionEnum.VIEW_DASHBOARD_EVALUATION,
  [menuJson.mentoriaDashboard]: PermissionEnum.VIEW_DASHBOARD_MENTORING,
  [menuJson.participantesDashboard]: PermissionEnum.VIEW_DASHBOARD_PARTICIPANTS,
  [menuJson.grupos]: PermissionEnum.VIEW_GROUPS,
  [menuJson.asistencia]: PermissionEnum.VIEW_ATTENDANCE,
  [menuJson.calificaciones]: PermissionEnum.VIEW_EVALUATION,
  [menuJson.mentoria]: PermissionEnum.VIEW_MENTORING,
  [menuJson.catalogos]: PermissionEnum.VIEW_CATALOGUES,
  [menuJson.centrosEscolares]: PermissionEnum.VIEW_CATALOGUE_SCHOOL,
  [menuJson.modulos]: PermissionEnum.VIEW_CATALOGUE_MODULE,
  [menuJson.zonas]: PermissionEnum.VIEW_CATALOGUE_ZONE
};
