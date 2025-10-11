import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class TrainingReportDto {
  @IsNumber()
  @Min(1, { message: "El puntaje final debe ser un número." })
  finalScore: number;

  @IsNumber()
  @Min(1, { message: "El porcentaje de asistencia debe ser un número." })
  attendancePercentage: number;

  @IsNotEmpty({ message: "El estado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El estado debe ser una cadena de texto." })
  status: string;

  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  inscriptionId: number;
}

export class TrainingReportPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
