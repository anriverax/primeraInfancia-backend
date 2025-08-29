import { Injectable } from "@nestjs/common";
import { IGroupedMentorsByMunicipality, IMentor, INewMentor } from "../dto/group.type";

@Injectable()
export class MentorService {
  groupByDepartment(
    workAssignment: {
      Municipality: Pick<
        {
          name: string;
          id: number;
          departmentId: number;
        },
        "name" | "id"
      >;
    }[]
  ): string {
    const grouped: Record<string, string[]> = {};

    for (const r of workAssignment) {
      const idx = r.Municipality.name.lastIndexOf(" ");
      const dep = r.Municipality.name.slice(0, idx);
      const zone = r.Municipality.name.slice(idx + 1);
      if (!grouped[dep]) grouped[dep] = [];
      grouped[dep].push(zone);
    }

    const resultado = Object.entries(grouped).map(([dep, zones]) => `${dep} ${zones.join("-")}`);

    return resultado[0];
  }
  // Sort mentors by municipality name
  sort(mentors: INewMentor[]): INewMentor[] {
    const mentorsSorted = mentors.sort((a, b) => {
      const nameA = a.workAssignment.name || "";
      const nameB = b.workAssignment.name || "";
      return nameA.localeCompare(nameB);
    });
    return mentorsSorted;
  }

  // Transform the data object to obtain only the main data from the mentors.
  order(mentors: IMentor[]): INewMentor[] {
    const mentorsData = mentors.map((t) => {
      const zoneNames = this.groupByDepartment(t.Person.WorkAssignment);
      return {
        mentorId: t.id,
        workAssignment: {
          id: t.Person.WorkAssignment[0]?.Municipality.id,
          name: zoneNames
        }
      };
    });

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
