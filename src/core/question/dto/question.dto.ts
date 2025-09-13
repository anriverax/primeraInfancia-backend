import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class QuestionDto {
  @IsNotEmpty({ message: "El enunciado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El enunciado debe ser una cadena de texto." })
  text: string;

  @IsNotEmpty({ message: "El tipo de pregunta es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El tipo de pregunta debe ser una cadena de texto." })
  questionType: string;

  @IsNotEmpty({ message: "El ordenamiento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El ordenamiento debe ser un número." })
  orderBy: number;

  @IsNotEmpty({ message: "La sub sección es obligatorio." })
  //@Transform(({ value }) => value.trim()) //Es necesario para los casos en los que según el Anexo no hay texto a presentar
  @IsString({ message: "La sub sección debe ser una cadena de texto." })
  subSection: string;

  @IsNotEmpty({ message: "Es requerido debe ser un valor lógico." })
  isRequired: boolean;

  @IsNotEmpty({ message: "La sección es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La sección debe ser un número." })
  sectionId: number;
}

export class QuestionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
