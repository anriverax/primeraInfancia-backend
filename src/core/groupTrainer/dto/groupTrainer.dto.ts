import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class GroupTrainerDto {
  @IsNotEmpty({ message: "El grupo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El grupo debe ser un número." })
  groupId: number;

  @IsNotEmpty({ message: "El formador del grupo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El formador del grupo debe ser un número." })
  trainerId: number;
}

export class GroupTrainerPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
