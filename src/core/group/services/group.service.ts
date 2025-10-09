import { Injectable } from "@nestjs/common";
import {
  IAssignedRole,
  IGroupTechSupport,
  IInscriptionPerson,
  IOrderAssignedRole
} from "../dto/group.type";

@Injectable()
export class GroupService {
  order(groupTechSupport: IGroupTechSupport[]): IOrderAssignedRole {
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
        acc.trainer = {
          id: g.AssignedRole.Person.id,
          fullName: `${g.AssignedRole.Person.firstName} ${g.AssignedRole.Person.lastName1} ${g.AssignedRole.Person.lastName2}`
        };

        return acc;
      },
      { trainer: {} as IAssignedRole }
    );

    const getMentors = groupTechSupport.reduce(
      (acc, g) => {
        acc.mentors = [
          ...new Map(
            g.MentorAssignment.map((item) => [
              item.Mentor.Person.id,
              {
                id: item.Mentor.Person.id,
                fullName: `${item.Mentor.Person.firstName} ${item.Mentor.Person.lastName1} ${item.Mentor.Person.lastName2}`
              }
            ])
          ).values()
        ];

        return acc;
      },
      { mentors: [] as IAssignedRole[] }
    );

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const getTeachers = groupTechSupport.reduce(
      (acc, ins) => {
        ins.MentorAssignment.forEach((item) => {
          const {
            PersonRole: { Person },
            ...i
          } = item.Inscription;

          const { User, PrincipalSchool, ...p } = Person;

          acc.teachers.push({
            id: i.id,
            status: (i.deletedAt ? "Inactivo" : "Activo") as "Activo" | "Inactivo",
            teacher: {
              id: p.id,
              fullName: `${p.firstName ?? ""} ${p.lastName1 ?? ""} ${p.lastName2 ?? ""}`.trim(),
              phoneNumber: p.phoneNumber,
              User,
              school: PrincipalSchool[0]?.School?.name ?? ""
            }
          });
        });

        return acc;
      },
      { teachers: [] as IInscriptionPerson[] }
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
      techSupport: getTechSupport.techSupport,
      trainer: getAssigneRole.trainer,
      mentors: getMentors.mentors,
      teachers: getTeachers.teachers
    };
  }
}
