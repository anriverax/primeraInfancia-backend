import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PersonRoleDto {
  @IsNotEmpty({ message: "El tipo de persona es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El tipo de persona debe ser un número." })
  typePersonId: number;

  @IsNotEmpty({ message: "La persona es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La persona debe ser un número." })
  personId: number;
}

export class PersonRolePaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
