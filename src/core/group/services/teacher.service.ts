import { Injectable } from "@nestjs/common";
import { INewTeacher, ITeacher, IGroupedTeachersByMunicipality } from "../dto/group.type";

@Injectable()
export class TeacherService {
  // Transform data object to obtain only the names of teachers and schools
  order(teachers: ITeacher[]): INewTeacher[] {
    const teachersData = teachers.map((school) => {
      const data = school.PrincipalSchool.map((ps) => ({
        id: ps.Person.id
      }));
      return {
        id: school.id,
        name: school.name,
        District: school.District,
        teachers: data
      };
    });

    return teachersData;
  }
  // Group teachers by municipality
  group(teachers: INewTeacher[]): IGroupedTeachersByMunicipality {
    const groupedByTeachersByMunicipality = teachers.reduce((acc, curr) => {
      const key = curr.District.Municipality.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});

    return groupedByTeachersByMunicipality;
  }

  // Sort schools by number of teachers in descending order within each municipality
  sort(teachers: ITeacher[]): IGroupedTeachersByMunicipality {
    // Group teachers by municipality
    const orderTeachers = this.order(teachers);
    const groupedByTeachersByMunicipality = this.group(orderTeachers);

    // Sort schools by number of teachers in descending order within each municipality
    /* eslint-disable @typescript-eslint/no-explicit-any */
    for (const [municipio, escuelas] of Object.entries(groupedByTeachersByMunicipality)) {
      groupedByTeachersByMunicipality[municipio] = (escuelas as any).sort(
        (a, b) => b.teachers.length - a.teachers.length
      );
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return groupedByTeachersByMunicipality;
  }
}
