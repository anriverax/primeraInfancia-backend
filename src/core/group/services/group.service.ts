import { Injectable } from "@nestjs/common";
import {
  IAssignedRole,
  IGroupByUser,
  IGroupByUserCustom,
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
          id: g.TechSupport.id,
          fullName: `${g.TechSupport.firstName} ${g.TechSupport.lastName1} ${g.TechSupport.lastName2}`
        };

        return acc;
      },
      { techSupport: {} as IAssignedRole }
    );

    const getAssigneRole = groupTechSupport.reduce(
      (acc, g) => {
        acc.trainer = {
          id: g.AssignedRole.id,
          fullName: `${g.AssignedRole.firstName} ${g.AssignedRole.lastName1} ${g.AssignedRole.lastName2}`
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
              item.Mentor.id,
              {
                id: item.Mentor.id,
                fullName: `${item.Mentor.firstName} ${item.Mentor.lastName1} ${item.Mentor.lastName2}`
              }
            ])
          ).values()
        ];

        return acc;
      },
      { mentors: [] as IAssignedRole[] }
    );

    const getTeachers = groupTechSupport.reduce(
      (acc, ins) => {
        ins.MentorAssignment.forEach((item) => {
          const { Person, ...i } = item.Inscription;

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

    return {
      techSupport: getTechSupport.techSupport,
      trainer: getAssigneRole.trainer,
      mentors: getMentors.mentors,
      teachers: getTeachers.teachers
    };
  }

  removeProperties(data: IGroupByUser[]): IGroupByUserCustom[] {
    const gdResult = data.map((item: IGroupByUser) => {
      const { Inscription } = item;
      const { Person, ...i } = Inscription;

      const data = {
        id: i.id,
        Person: {
          id: Person.id,
          fullName: `${Person.firstName} ${Person.lastName1} ${Person.lastName2}`,
          phoneNumber: Person.phoneNumber,
          email: Person.User?.email ?? "",
          school: Person.PrincipalSchool[0]?.School?.name ?? "",
          district: Person.PrincipalSchool[0]?.School?.District?.name,
          municipality: Person.PrincipalSchool[0]?.School?.District?.Municipality?.name
        }
      };

      return data;
    });
    return gdResult;
  }
}
