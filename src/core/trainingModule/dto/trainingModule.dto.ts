import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TrainingModuleDto {
  @IsNotEmpty({ message: "El módulo formativo es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El módulo formativo debe ser una cadena de texto." })
  moduleName: string;
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
