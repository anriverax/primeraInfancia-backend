import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class MultipleAnswerDto {
  @IsNotEmpty({ message: "La respuesta es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La respuesta debe ser un número." })
  answerId: number;

  @IsNotEmpty({ message: "La opción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La opción debe ser un número." })
  optionId: number;

}

export class MultipleAnswerPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
