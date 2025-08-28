import {
  IGroupedMentorsByMunicipality,
  IGroupedTeachersByMunicipality,
  IMentorsByMunicipality
} from "../dto/group.type";

export class AssignTeacherService {
  numericalDistribution(teachers: number, mentors: number): { limit: number; remains: number } {
    const limit = Math.floor(teachers / mentors);
    const remains = teachers % mentors;

    console.log(`Municipio: Ahuachapan`);
    console.log(`Total docentes: ${teachers}`);
    console.log(`Mentores: ${mentors}`);
    console.log(`Cada mentor debe tener aprox: ${limit} docentes (+1 para ${remains} mentores)`);

    return { limit, remains };
  }

  distributeSchools(
    teachers: IGroupedTeachersByMunicipality,
    mentors: IGroupedMentorsByMunicipality,
    distribution: { limit: number; remains: number },
    groupId: number
  ): IMentorsByMunicipality[] {
    const result: IMentorsByMunicipality[] = [];
    for (const [m, s] of Object.entries(teachers)) {
      // Clonamos el array de mentores de ese municipio
      const mentorsByMunicipality: IMentorsByMunicipality[] = mentors[m].map((m) => ({
        ...m,
        teachers: [],
        limit: distribution.limit + (distribution.remains-- > 0 ? 1 : 0),
        groupId,
        assignedSchools: new Set<string>() // Para evitar compartir escuela
      }));

      const orderSchool = s.sort((a, b) => b.teachers.length - a.teachers.length);

      for (const school of orderSchool) {
        const remainingTeachers = [...school.teachers];
        // Distribuimos los docentes de esta escuela entre mentores que no tengan la escuela
        while (remainingTeachers.length > 0) {
          // Ordenamos mentores por menor cantidad de docentes asignados y que no tengan esta escuela
          const availableMentors = mentorsByMunicipality
            .filter((m) => !m.assignedSchools.has(school.name) && m.teachers.length < m.limit)
            .sort((a, b) => a.teachers.length - b.teachers.length || a.limit - b.limit);

          if (availableMentors.length === 0) break;

          const mentor = availableMentors[0];
          const slotsAvailable = mentor.limit - mentor.teachers.length;
          const teachersToAssign = remainingTeachers.splice(0, slotsAvailable);
          console.log(teachersToAssign);
          mentor.teachers.push(...teachersToAssign);
          mentor.assignedSchools.add(school.name);
        }
      }
      result.push(...mentorsByMunicipality);
    }

    return result;
  }
}
