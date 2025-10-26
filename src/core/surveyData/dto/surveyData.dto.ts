import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class SurveyDataDto {
  @IsNotEmpty({ message: "El número de intento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El número de intento debe ser numérico." })
  bash: number;

  @IsNotEmpty({ message: "La encuesta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La encuesta debe ser un número." })
  appendixId: number;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser un número." })
  /* eslint-disable @typescript-eslint/no-explicit-any */
  survey: Record<string, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  @IsNotEmpty({ message: "La inscripcion es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La inscripcion debe ser un número." })
  inscriptionId: number;
}

export class SurveyDataPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
