import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class InscriptionDto {
  @IsNumber()
  @Min(1, { message: "El docente debe ser un número." })
  teacherId: number;

  @IsNumber()
  @Min(1, { message: "El grupo debe ser un número." })
  groupId: number;
}

export class InscriptionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
