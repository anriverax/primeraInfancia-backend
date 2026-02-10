import { Injectable } from "@nestjs/common";
import { IParsedName } from "../../application/dto/group.type";

@Injectable()
export class NameParserService {
  /**
   * Parsea un nombre completo en firstName, lastName1, lastName2
   *
   * Reglas:
   * - 2 palabras: firstName + lastName1
   * - 3 palabras: firstName + lastName1 + lastName2
   * - 4+ palabras: firstName (primeras palabras) + lastName1 + lastName2
   */
  parse(fullName: string): IParsedName {
    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 0) {
      throw new Error("Nombre vacío");
    }

    if (parts.length === 1) {
      return {
        firstName: parts[0],
        lastName1: ""
      };
    }

    if (parts.length === 2) {
      return {
        firstName: parts[0],
        lastName1: parts[1]
      };
    }

    if (parts.length === 3) {
      return {
        firstName: parts[0],
        lastName1: parts[1],
        lastName2: parts[2]
      };
    }

    // 4 o más palabras: nombres compuestos
    // Ejemplo: "Juan Carlos Pérez García" → firstName: "Juan Carlos", lastName1: "Pérez", lastName2: "García"
    return {
      firstName: parts.slice(0, -2).join(" "),
      lastName1: parts[parts.length - 2],
      lastName2: parts[parts.length - 1]
    };
  }

  /**
   * Valida si un nombre parseado es válido
   */
  isValid(parsed: IParsedName): boolean {
    return parsed.firstName.length > 0 && parsed.lastName1.length > 0;
  }
}
