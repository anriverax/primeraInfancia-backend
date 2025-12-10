import { Injectable } from "@nestjs/common";
import {
  IMentorResult,
  IMentors,
  ITeachersAssignmentMentor,
  ITeachersAssignmentMentorResult
} from "../dto/attendance.type";
import { formatDate } from "@/common/helpers/functions";

@Injectable()
export class MentorAssignmentService {
  /**
   * Normalize teacher assignments for mentors into a lightweight list.
   *
   * Input
   * - data: Raw teacher assignments from MentorAssignment query
   *
   * Output
   * - Array of { id, fullName, School { code, name, coordenates, location } }
   *   filtered to non-deleted inscriptions and active principal school
   */
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

  /**
   * Group last attendance records by event for teachers (typePersonId === 2).
   *
   * Input
   * - data: Array of last attendance records
   *
   * Output
   * - Array of grouped objects: { id, event, checkIn, modality, details[] }
   */
  getTeachersByTypePerson(data) {
    const teachers = data.filter((d) => d.PersonRole.typePersonId === 2);

    const result = teachers.reduce(
      (acc, t) => {
        const key = t.EventInstance.id;
        const teacher = t.PersonRole.Person;
        const fullName = `${teacher.firstName} ${teacher.lastName1} ${teacher.lastName2}`;
        if (!acc[key]) {
          acc[key] = {
            id: t.EventInstance.id,
            event: t.EventInstance.id.toString(),
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
      {} as Record<string, any>
    );

    const arrayResult = Object.values(result);

    return arrayResult;
  }

  /**
   * Map mentors assigned to a tech support user to a simple list.
   *
   * Input
   * - data: Array of mentor assignments (IMentors[])
   *
   * Output
   * - Array of { id, fullName } for mentors with deletedBy === null
   */
  getMentorsByTechSupport(data: IMentors[]) {
    const newData: IMentorResult[] = [];

    data.forEach((d) => {
      const { deletedBy } = d.Mentor;

      if (deletedBy === null) {
        const id = d.Mentor.id;
        const { firstName, lastName1, lastName2 } = d.Mentor.Person;
        const fullName = `${firstName} ${lastName1} ${lastName2}`;

        newData.push({ id, fullName });
      }
    });

    return newData;
  }
}
