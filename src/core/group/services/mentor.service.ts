import { Injectable } from "@nestjs/common";
import { IGroupedMentorsByMunicipality, IMentor, INewMentor } from "../dto/group.type";

@Injectable()
export class MentorService {
  // Sort mentors by municipality name
  sort(mentors: INewMentor[]) {
    const mentorsSorted = mentors.sort((a, b) => {
      const nameA = a.workAssignment.name || "";
      const nameB = b.workAssignment.name || "";
      return nameA.localeCompare(nameB);
    });
    return mentorsSorted;
  }

  // Transform the data object to obtain only the main data from the mentors.
  order(mentors: IMentor[]): INewMentor[] {
    const mentorsData = mentors.map((t) => ({
      mentorId: t.id,
      workAssignment: {
        id: t.Person.WorkAssignment[0]?.Municipality.id,
        name: t.Person.WorkAssignment[0]?.Municipality.name
      }
    }));

    const mentorsSorted = this.sort(mentorsData);
    return mentorsSorted;
  }

  // Group mentors by municipality
  group(mentors: INewMentor[]): IGroupedMentorsByMunicipality {
    const groupedMetorsByMunicipality = mentors.reduce((acc, curr) => {
      const key = curr.workAssignment.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    return groupedMetorsByMunicipality;
  }
}
