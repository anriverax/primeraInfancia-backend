import { Injectable } from "@nestjs/common";
import { ITeachersAssignmentMentor, ITeachersAssignmentMentorResult } from "../dto/attendance.type";

@Injectable()
export class MentorAssignmentService {
  order(data: ITeachersAssignmentMentor[]): ITeachersAssignmentMentorResult[] {
    const newData: ITeachersAssignmentMentorResult[] = [];

    data.forEach((d) => {
      const { deletedBy, PersonRole } = d.Inscription;

      if (!deletedBy && !PersonRole.deletedBy && !PersonRole.Person.deletedBy) {
        const id = PersonRole.id;
        const fullName = `${PersonRole.Person.firstName} ${PersonRole.Person.lastName1} ${PersonRole.Person.lastName2}`;

        const principalSchool = PersonRole.Person.PrincipalSchool.filter((p) => p.deletedBy === null);

        const { code, name, coordenates, District } = principalSchool[0].School;
        const location = `${District.Municipality.name} / ${District.name}`;

        const School = {
          code,
          name,
          coordenates,
          location
        };

        newData.push({ id, fullName, School });
      }
    });

    return newData;
  }
}
