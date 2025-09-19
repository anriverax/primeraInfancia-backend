import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
  getAge(birthdate: string): number {
    const currentDate = new Date();
    const birth = new Date(birthdate);
    let age = currentDate.getFullYear() - birth.getFullYear();
    const monthDiff = currentDate.getMonth() - birth.getMonth();
    const dayDiff = currentDate.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  }

  groupByRanges(
    ages: number[],
    step = 10
  ): {
    range: string;
    quantity: number;
  }[] {
    const groups: Record<string, number> = {};

    for (const age of ages) {
      const min = Math.floor(age / step) * step;
      const max = min + step - 1;
      const range = `${min}-${max}`;
      groups[range] = (groups[range] || 0) + 1;
    }

    // Ordenar rangos por edad mínima
    return Object.entries(groups)
      .sort(([a], [b]) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]))
      .map(([range, quantity]) => ({
        range,
        quantity
      }));
  }

  calculateAge(data: { birthdate: string | null }[]): {
    range: string;
    quantity: number;
  }[] {
    const filterNull = data.filter((f: { birthdate: string | null }) => f.birthdate !== null) as {
      birthdate: string;
    }[];

    const ages = filterNull.map((f: { birthdate: string }) => this.getAge(f.birthdate));

    const result = this.groupByRanges(ages, 10);

    return result;
  }
}
