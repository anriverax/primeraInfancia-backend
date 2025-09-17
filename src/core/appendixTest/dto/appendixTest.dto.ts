import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class AppendixTestDto {
  @IsNotEmpty({ message: "El anexo es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El anexo debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La pregunta debe ser una cadena de texto." })
  textQuestion: string;

  @IsNotEmpty({ message: "La respuesta es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La respuesta debe ser una cadena de texto." })
  textAnswer: string;

  @IsNotEmpty({ message: "El profesor es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El profesor debe ser un número." })
  teacherRoleId: number;

  @IsNotEmpty({ message: "El mentor es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El mentor debe ser un número." })
  mentorRoleId: number;
}

export class AppendixTestPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
