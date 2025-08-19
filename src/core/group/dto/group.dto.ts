import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class GroupDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "La descripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el número de miembros." })
  memberCount: number;

  @IsNotEmpty({ message: "La descripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el número de miembros." })
  zoneId: number;
}
