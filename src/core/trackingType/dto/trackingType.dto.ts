import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class TrackingTypeDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "El formato de entrega es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El formato de entrega debe ser una cadena de texto." })
  deliveryMethod: string;
}

export class TrackingTypePaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
