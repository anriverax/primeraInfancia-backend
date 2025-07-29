import { GroupLeader } from "@prisma/client";

export type ICreateGroupLeader = Pick<GroupLeader, "trainerId" | "groupId" | "createdBy">;
export type IDeleteGroupLeader = Pick<GroupLeader, "id" | "deletedBy">;
