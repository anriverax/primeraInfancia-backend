import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsDate } from "class-validator";

export class TrainingModuleDto {
  @IsNotEmpty({ message: "El módulo formativo es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El módulo formativo debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "El título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El título debe ser una cadena de texto." })
  title: string;

  @IsNotEmpty({ message: "La fecha de inicio es obligatoria." })
  @IsDate({ message: "La fecha de inicio debe contener un formato de fecha válido." })
  startDate: Date;

  @IsNotEmpty({ message: "La fecha de finalización es obligatoria." })
  @IsDate({ message: "La fecha de finalización debe contener un formato de fecha válido." })
  endDate: Date;

  @IsNotEmpty({ message: "La cantidad de horas es un campo obligatorio." })
  @IsNumber()
  hours: number;

  @IsNotEmpty({ message: "El id de la cohorte es un campo obligatorio." })
  @IsNumber()
  cohortId: number;
}

export class TrainingModulePaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
