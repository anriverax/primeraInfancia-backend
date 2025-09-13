import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class EvidenceDto {
  @IsNotEmpty({ message: "La evidencia es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La evidencia debe ser una cadena de texto." })
  Evidence: string;

  @IsNotEmpty({ message: "El seguimiento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El seguimiento debe ser un número." })
  trackingId: number;
}

export class EvidencePaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
