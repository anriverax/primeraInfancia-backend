import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class ModuleReportDto {
  @IsNumber()
  @Min(1, { message: "El puntaje del módulo debe ser un número." })
  moduleScore: number;
  
  @IsNotEmpty({ message: "El estado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El estado debe ser una cadena de texto." })
  status: string;
  
  @IsNumber()
  @Min(1, { message: "El módulo formativo debe ser un número." })
  trainingModuleId: number;
  
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  enrollmentId: number;
  
}

export class ModuleReportPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
