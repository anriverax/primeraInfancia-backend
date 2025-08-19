import { GroupLeader, Inscription, PersonRole } from "@prisma/client";

export type ICreateAssignTypePerson = Pick<GroupLeader, "trainerId" | "groupId" | "createdBy">;
export type IDeleteAssignTypePerson = Pick<GroupLeader, "id" | "deletedBy">;

export type IPersonRole = Pick<PersonRole, "id">;
export type IInscription = Pick<Inscription, "groupId" | "teacherId" | "createdBy">;
