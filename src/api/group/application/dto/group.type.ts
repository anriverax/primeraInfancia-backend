import {
  Department,
  Group,
  Person,
  RoleType,
  TeacherStatus,
  TypePersonEnum
} from "prisma/generated/client";

export interface IGroupListResponse extends Pick<Department, "id" | "name"> {
  Group: Pick<Group, "id" | "name" | "memberCount">[];
}

export interface IPersonData extends Omit<
  Person,
  | "id"
  | "lastName2"
  | "birthdate"
  | "typePersonId"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "updatedBy"
  | "deletedBy"
> {
  nip: number | null;
  lastName2?: string | null;
  typePersonId: number;
}

export interface IUserData {
  personId?: number;
  email: string;
  passwd: string;
  Role: {
    connect: {
      name: RoleType;
    };
  };
  createdBy: number;
}
export interface IPersonWithType {
  id: number;
  fullName: string;
  TypePerson: {
    id: number;
    name: TypePersonEnum;
  };
}

export interface IPersonNotFound {
  id: number | -1;
  fullName: string;
  excel: boolean;
  db: boolean;
}

export interface IExcelReadCompareResult {
  label: string;
  found: string;
  notFound: IPersonNotFound[];
}

export interface IExcelRow {
  idGrupo: number;
  grupo: string;
  tecnico: string;
  formador: string;
  mentor: string;
  docente: string;
  idDocente: number;
  dui: string;
  sexo: string;
  telefono: string;
  nip: string;
  email: string;
  centroEducativo: string;
  codigo: string;
  idCentroEducativo: number;
  distrito: string;
  idDistrito: number;
  estado: string;
}

export interface IGroupHierarchy {
  groupId: number;
  groupName: string;
  technicians: Map<string, ITechnicianData>;
}

export interface ITechnicianData {
  name: string;
  personId?: number;
  groupStaffId?: number;
  trainers: Map<string, ITrainerData>;
  wasFoundInOtherRole?: TypePersonEnum;
  isNew: boolean;
}

export interface ITrainerData {
  name: string;
  personId?: number;
  groupStaffId?: number;
  mentors: Map<string, IMentorsData>;
  wasFoundInOtherRole?: TypePersonEnum;
  isNew: boolean;
}

export interface IMentorsData {
  name: string;
  personId?: number;
  groupStaffId?: number;
  teachers: ITeachersData[];
  wasFoundInOtherRole?: TypePersonEnum;
  isNew: boolean;
}

export interface ITeachersData {
  id: number;
  fullName: string;
  dui: string;
  sex: string;
  phoneNumber: string;
  nip: number;
  email: string;
  schoolId: number;
  schoolName: string;
  schoolCode: number;
  districtId: number;
  district: string;
  state: string; // Actualizado, Cambio de nivel, Jubilado, etc.
  personId?: number;
  isNew?: boolean;
  onlyAssignGroup?: boolean;
}

export interface ITeacherDataWithPerson {
  id: number;
  Person: Omit<IPersonWithType, "TypePerson">;
}

export interface IGroupWithTeachers {
  id: number;
  School: {
    id: number;
    name: string;
    code: string;
  };
  Person: Omit<IPersonWithType, "TypePerson">;
}

export interface IGroupWithStaff {
  id: number;
  personId: number;
  parentId: number | null;
  Person: IPersonWithType;
  Teacher: IGroupWithTeachers[];
}

export interface IGroupResponse {
  id: number;
  name: string;
  GroupStaff: IGroupWithStaff[];
}

export interface IPersonFromDB extends Omit<IPersonWithType, "TypePerson"> {
  typePerson: TypePersonEnum;
  groupStaffId?: number;
}

export interface LoadDBDataResult {
  technicians: IPersonFromDB[];
  trainers: IPersonFromDB[];
  mentors: IPersonFromDB[];
  allStaff: IPersonFromDB[];
  teachers: IPersonFromDB[];
}

export interface IProcessExcelStats {
  totalRows: number;
  groupsProcessed: number;
  techniciansProcessed: number;
  trainersProcessed: number;
  mentorsProcessed: number;
  teachersProcessed: number;
  techniciansReplaced: number;
  trainersReplaced: number;
  mentorsReplaced: number;
  peopleCreated: number;
  techniciansInactivated: number;
  trainersInactivated: number;
  mentorsInactivated: number;
  teachersInactivated: number;
  errors: string[];
  warnings: string[];
}

export interface IParsedName {
  firstName: string;
  lastName1: string;
  lastName2?: string;
}

export interface ITeacherData {
  schoolId: number;
  personId: number;
  groupStaffId: number;
  status: TeacherStatus;
  createdBy: number;
}

export interface IGroupStaffData {
  groupId: number;
  personId: number;
  parentId: number | null;
  predecessorPersonId: number | null;
  createdBy: number;
}

export interface IteacherInOtherMentor {
  id: number;
  updatedBy: number;
  GroupStaff: {
    id: number;
    Person: {
      id: number;
      fullName: string;
    };
  };
}
