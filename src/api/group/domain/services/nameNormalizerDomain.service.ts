import { Injectable } from "@nestjs/common";
import { IPersonNotFound } from "../../application/dto/group.type";

@Injectable()
export class NameNormalizerService {
  normalize(name: string): string {
    if (!name) return "";

    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  areEqual(name1: string, name2: string): boolean {
    return this.normalize(name1) === this.normalize(name2);
  }

  /**
   * Busca una persona en una lista por nombre normalizado
   */
  findByName<T extends { firstName: string; lastName: string; secondLastName?: string }>(
    persons: T[],
    searchName: string
  ): T | undefined {
    const normalizedSearch = this.normalize(searchName);

    return persons.find((person) => {
      const fullName = `${person.firstName} ${person.lastName} ${person.secondLastName || ""}`.trim();
      const normalizedFullName = this.normalize(fullName);
      return normalizedFullName === normalizedSearch;
    });
  }

  /**
   * Genera una clave única normalizada para usar en Maps
   */
  generateKey(name: string): string {
    return this.normalize(name);
  }

  matchByNormalizedKey<T>(
    sourceNames: Iterable<string>,
    uniqueTechnicalSize: number,
    targetItems: Iterable<T>,
    getTargetName: (item: T) => string
  ): { found: string; notFound: IPersonNotFound[] } {
    let tempId: number = 1;
    // Results
    const found: Array<{ source: string; target: T }> = [];
    const notFound: IPersonNotFound[] = [];

    // 1. Normalize sourceNames
    const normalizedSource = new Map<string, string>();
    for (const name of sourceNames) {
      const normalized = this.normalize(name);
      normalizedSource.set(normalized, name);
    }

    // 2. Normalize targetItems
    const normalizedTargets = new Map<string, T>();
    for (const item of targetItems) {
      const normalized = this.normalize(getTargetName(item));
      normalizedTargets.set(normalized, item);
    }

    // 4. sourceNames → targetItems
    for (const [normalized, originalName] of normalizedSource.entries()) {
      const match = normalizedTargets.get(normalized);
      if (match) {
        found.push({ source: originalName, target: match });
      } else {
        notFound.push({
          id: tempId++,
          fullName: originalName,
          excel: true,
          db: false
        });
      }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    // 5. targetItems → sourceNames
    for (const [normalized, item] of normalizedTargets.entries()) {
      if (!normalizedSource.has(normalized)) {
        notFound.push({
          id: (item as any).id,
          fullName: getTargetName(item),
          excel: false,
          db: true
        });
      }
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
      found: `${found.length}/${uniqueTechnicalSize}`,
      notFound
    };
  }
}
