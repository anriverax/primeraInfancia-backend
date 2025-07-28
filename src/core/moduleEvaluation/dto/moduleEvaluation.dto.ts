import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class ModuleEvaluationDto {
  @IsNotEmpty({ message: "La calificación es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La calificación debe ser un número." })
  grade: number;

  @IsNotEmpty({ message: "Los comentarios son obligatorios." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "Los comentarios deben ser una cadena de texto." })
  comment: string;

  @IsNotEmpty({ message: "El estado de progreso en el módulo es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El estado de progreso en el módulo debe ser una cadena de texto." })
  moduleProgressStatus: string;

  @IsNotEmpty({ message: "El instrumento de evaluación es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El instrumento de evaluación debe ser un número." })
  evaluationInstrumentId: number;

  @IsNotEmpty({ message: "La inscripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  enrollmentId: number;

  @IsNotEmpty({ message: "El módulo formativo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El módulo formativo debe ser un número." })
  trainingModuleId: number;
}

export class ModuleEvaluationPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
