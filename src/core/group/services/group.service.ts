import { Injectable } from "@nestjs/common";
import {
  IInscription,
  IInscriptionPerson,
  ILeader,
  IMentor,
  INewLeader,
  INewMentor
} from "../dto/group.type";

@Injectable()
export class GroupService {
  order(
    groupLeader: ILeader[],
    inscriptions: IInscription[],
    groupMentors: IMentor[]
  ): { leaders: INewLeader; inscriptionPerson: IInscriptionPerson[]; mentors: INewMentor[] } {
    let leaders: INewLeader = {} as INewLeader;
    let inscriptionPerson: IInscriptionPerson[] = [];

    let mentors: INewMentor[] = [];

    if (groupLeader && Array.isArray(groupLeader)) {
      const {
        PersonRole: { Person }
      } = groupLeader[0];

      leaders = {
        id: Person.id,
        fullName: `${Person.firstName ?? ""} ${Person.lastName1 ?? ""} ${Person.lastName2 ?? ""}`.trim()
      };
    }

    if (inscriptions && Array.isArray(inscriptions)) {
      inscriptionPerson = inscriptions.map((inscription) => {
        const {
          PersonRole: { Person },
          ...restIns
        } = inscription;

        const { User, PrincipalSchool, ...restPerson } = Person;

        return {
          id: restIns.id,
          status: restIns.deletedAt ? "Inactivo" : "Activo",
          teacher: {
            id: restPerson.id,
            fullName:
              `${restPerson.firstName ?? ""} ${restPerson.lastName1 ?? ""} ${restPerson.lastName2 ?? ""}`.trim(),
            phoneNumber: restPerson.phoneNumber,
            User,
            school: PrincipalSchool[0].School.name
          }
        };
      });
    }

    if (groupMentors && Array.isArray(groupMentors)) {
      mentors = groupMentors.map((mentor) => {
        const Person = mentor.PersonRole.Person;

        return {
          id: Person.id,
          fullName:
            `${Person.firstName ?? ""} ${Person.lastName1 ?? ""} ${Person.lastName2 ?? ""}`.trim(),
          assignedMunicipality: Person.WorkAssignment[0].Municipality.name
        };
      });
    }

    return {
      leaders,
      inscriptionPerson,
      mentors
    };
  }
}
