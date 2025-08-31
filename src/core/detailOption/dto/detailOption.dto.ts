import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class DetailOptionDto {
  @IsNotEmpty({ message: "El enunciado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El enunciado debe ser una cadena de texto." })
  textToDisplay: string;

  @IsNotEmpty({ message: "La opción es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La opción debe ser un número." })
  optionId: number;

}

export class DetailOptionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
