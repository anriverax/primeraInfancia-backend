import { Injectable } from "@nestjs/common";
import { IAssignedRole, IGroupTechSupport, IInscription, IOrderAssignedRole } from "../dto/group.type";
import { TypePersonEnum } from "@prisma/client";

@Injectable()
export class GroupService {
  order(groupTechSupport: IGroupTechSupport[], inscriptions: IInscription[]): IOrderAssignedRole {
    const getTechSupport = groupTechSupport.reduce(
      (acc, g) => {
        acc.techSupport = {
          id: g.TechSupport.Person.id,
          fullName: `${g.TechSupport.Person.firstName} ${g.TechSupport.Person.lastName1} ${g.TechSupport.Person.lastName2}`
        };

        return acc;
      },
      { techSupport: {} as IAssignedRole }
    );

    const getAssigneRole = groupTechSupport.reduce(
      (acc, g) => {
        if (g.AssignedRole.TypePerson.name === TypePersonEnum.FORMADOR) {
          acc.trainer = {
            id: g.AssignedRole.Person.id,
            fullName: `${g.AssignedRole.Person.firstName} ${g.AssignedRole.Person.lastName1} ${g.AssignedRole.Person.lastName2}`
          };
        } else {
          acc.mentors.push({
            id: g.TechSupport.Person.id,
            fullName: `${g.AssignedRole.Person.firstName} ${g.AssignedRole.Person.lastName1} ${g.AssignedRole.Person.lastName2}`
          });
        }

        return acc;
      },
      { trainer: {} as IAssignedRole, mentors: [] as IAssignedRole[] }
    );

    const teachers =
      inscriptions.length > 0
        ? inscriptions.map((inscription) => {
            const {
              PersonRole: { Person },
              ...i
            } = inscription;

            const { User, PrincipalSchool, ...p } = Person;

            return {
              id: i.id,
              status: (i.deletedAt ? "Inactivo" : "Activo") as "Activo" | "Inactivo",
              teacher: {
                id: p.id,
                fullName: `${p.firstName ?? ""} ${p.lastName1 ?? ""} ${p.lastName2 ?? ""}`.trim(),
                phoneNumber: p.phoneNumber,
                User,
                school: PrincipalSchool[0].School.name
              }
            };
          })
        : [];

    return {
      techSupport: getTechSupport.techSupport,
      trainer: getAssigneRole.trainer,
      mentors: getAssigneRole.mentors,
      teachers
    };
  }
}
