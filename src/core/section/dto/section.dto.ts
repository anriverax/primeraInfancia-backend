import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class SectionDto {
  @IsNotEmpty({ message: "El título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El título debe ser una cadena de texto." })
  title: string;

  @IsNotEmpty({ message: "El resumen es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El resumen debe ser una cadena de texto." })
  summary: string;

  @IsNotEmpty({ message: "El ordenamiento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El ordenamiento debe ser un número." })
  orderBy: number;

  @IsNotEmpty({ message: "El instrumento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El instrumento debe ser un número." })
  appendixId: number;
}

export class SectionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
