import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class ResponseSessionDto {
  @IsNotEmpty({ message: "El estado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El estado debe ser una cadena de texto." })
  status: string;

  @IsNotEmpty({ message: "La inscripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  inscriptionId: number;

  @IsNotEmpty({ message: "El instrumento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El instrumento debe ser un número." })
  instrumentId: number;

  @IsNotEmpty({ message: "El segumiento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El segumiento debe ser un número." })
  trackingId: number;
}

export class ResponseSessionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
