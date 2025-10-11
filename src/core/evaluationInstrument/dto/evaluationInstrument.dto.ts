import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class EvaluationInstrumentDto {
  @IsNotEmpty({ message: "El código es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El código debe ser una cadena de texto." })
  code: string;

  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "La periocidad es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La periocidad debe ser una cadena de texto." })
  periodicity: string;

  @IsNumber({}, { message: "El porcentaje debe ser un número." })
  percentage: number;
}

export class EvaluationInstrumentPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
