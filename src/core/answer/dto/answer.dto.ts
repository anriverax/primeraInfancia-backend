import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min
} from "class-validator";

export class AnswerDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El texto debe ser una cadena de texto." })
  valueText: string;

  @IsNumber()
  @Min(1, { message: "El valor debe ser un número." })
  valueNumber: number;

  @IsDate()
  valueDate: Date;

  @IsBoolean()
  valueBoolean: boolean;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser un número." })
  questionId: number;

  @IsNotEmpty({ message: "La aplicación es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La aplicación debe ser un número." })
  responseSessionId: number;
}

export class AnswerPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
