import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * Data Transfer Object used to validate and transform incoming Department creation payloads.
 *
 * Validation messages are currently in Spanish to align with API localization.
 */
export class DepartmentDto {
  /**
   * Department human-readable name.
   * - Trimmed automatically.
   */
  @IsNotEmpty({ message: "El nombre es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto válida." })
  name: string;

  /**
   * External geoname identifier associated with the Department.
   */
  @IsNotEmpty({ message: "El id de geoname es un campo obligatorio." })
  @Type(() => Number)
  @IsNumber()
  geonameId: number;

  /**
   * Zone identifier used for regional grouping.
   */
  @IsNotEmpty({ message: "El id de zona es un campo obligatorio." })
  @IsNumber()
  zoneId: number;
}
