import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class EnrollmentDto {
  @IsNumber()
  @Min(1, { message: "El docente debe ser un número." })
  teacherId: number;

  @IsNumber()
  @Min(1, { message: "El grupo debe ser un número." })
  groupId: number;

  @IsNotEmpty({ message: "El estado administrativo es obligatorio." })
  @IsString({ message: "El estado administrativo debe ser una cadena de texto." })
  administrativeStatus: string;
}

export class EnrollmentPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
