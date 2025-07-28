import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class TrainingReportDto {
  @IsNumber()
  @Min(1, { message: "El puntaje final debe ser un número." })
  finalScore: number;

  @IsNotEmpty({ message: "El estado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El estado debe ser una cadena de texto." })
  status: string;

  @IsNotEmpty({ message: "Las fortalezas, áreas de mejora y recomendaciones son obligatorias." })
  @Transform(({ value }) => value.trim())
  @IsString({
    message: "Las fortalezas, áreas de mejora y recomendaciones debe ser una cadena de texto."
  })
  remark: string;
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
