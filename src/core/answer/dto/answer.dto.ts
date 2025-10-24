import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AnswerDto {
  @IsNotEmpty({ message: "El texto es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El texto debe ser una cadena de texto." })
  valueText: string;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser una cadena de texto." })
  questionId: number;

  @IsNotEmpty({ message: "La inscripcion es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La inscripcion debe ser un número." })
  inscriptionId: number;

  @IsNotEmpty({ message: "La inscripcion es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El anexo debe ser un número." })
  appendixId: number;
}
