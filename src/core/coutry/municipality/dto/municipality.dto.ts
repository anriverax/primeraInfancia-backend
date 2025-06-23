import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

class CreateDistrictDto {
  @IsNotEmpty({ message: "El nombre del distrito es un campo obligatorio." })
  @IsString({ message: "El nombre del distrito debe ser una cadena de texto válida." })
  name: string;
}

class DistrictWrapperDto {
  @ValidateNested({ each: true })
  @Type(() => CreateDistrictDto)
  create: CreateDistrictDto[];
}

export class MunicipalityDto {
  @IsNotEmpty({ message: "El nombre es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto válida." })
  name: string;

  @IsNotEmpty({ message: "El id del departamento es un campo obligatorio." })
  @IsNumber()
  departmentId: number;

  @IsObject({ message: "El campo 'district' debe ser un objeto." })
  @ValidateNested()
  @Type(() => DistrictWrapperDto)
  District: DistrictWrapperDto;
}
