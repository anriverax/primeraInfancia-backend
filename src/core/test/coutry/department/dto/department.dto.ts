import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DepartmentDto {
  @IsNotEmpty({ message: "El nombre es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto válida." })
  name: string;

  @IsNotEmpty({ message: "El id de geoname es un campo obligatorio." })
  @IsNumber()
  geonameId: number;
  @IsNotEmpty({ message: "El id de zona es un campo obligatorio." })
  @IsNumber()
  zoneId: number;
}
