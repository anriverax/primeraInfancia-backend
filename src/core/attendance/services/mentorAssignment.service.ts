import { Injectable } from "@nestjs/common";
import {
  IFindLastAttendace,
  ILastAttendance,
  ITeachersAssignmentMentor,
  ITeachersAssignmentMentorResult
} from "../dto/attendance.type";
import { formatDate } from "@/common/helpers/functions";

@Injectable()
export class MentorAssignmentService {
  order(data: ITeachersAssignmentMentor[]): ITeachersAssignmentMentorResult[] {
    const newData: ITeachersAssignmentMentorResult[] = [];

    data.forEach((d) => {
      const { deletedBy, PersonRole } = d.Inscription;
      const person = PersonRole.Person;

      const principalSchool = PersonRole.Person.PrincipalSchool.find((p) => p.deletedBy === null);

      if (deletedBy === null && principalSchool) {
        const id = PersonRole.id;
        const fullName = `${person.firstName} ${person.lastName1} ${person.lastName2}`;

        const { code, name, coordenates, District } = principalSchool.School;
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

  getTeachersByTypePerson(data: IFindLastAttendace[]): ILastAttendance[] {
    const teachers = data.filter((d: IFindLastAttendace) => d.PersonRole.typePersonId === 2);

    const result = teachers.reduce(
      (acc, t) => {
        const key = t.Event.name;
        const teacher = t.PersonRole.Person;
        const fullName = `${teacher.firstName} ${teacher.lastName1} ${teacher.lastName2}`;
        if (!acc[key]) {
          acc[key] = {
            id: t.Event.id,
            event: t.Event.name,
            checkIn: formatDate(t.checkIn),
            modality: t.modality,
            details: []
          };
        }
        acc[key].details.push({
          coordenates: t.coordenates,
          fullName
        });

        return acc;
      },
      {} as Record<string, ILastAttendance>
    );

    const arrayResult = Object.values(result);

    return arrayResult;
  }
}
