import { Injectable } from "@nestjs/common";
import { IInscription, IInscriptionPerson, ILeader, IMentor, INewLeader } from "../dto/group.type";

@Injectable()
export class GroupService {
  order(groupLeader: ILeader[], inscriptions: IInscription[], groupMentors: IMentor[]) {
    let leaders: INewLeader;
    let inscriptionPerson: IInscriptionPerson[] = [];

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
          ...restIns,
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
      const {
        PersonRole: { Person }
      } = groupLeader[0];

      leaders = {
        id: Person.id,
        fullName: `${Person.firstName ?? ""} ${Person.lastName1 ?? ""} ${Person.lastName2 ?? ""}`.trim()
      };
    }
  }
}
