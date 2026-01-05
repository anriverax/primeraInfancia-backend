import { AttendanceEnum } from "prisma/generated/client";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AttendanceModalityEnum } from "@/common/helpers/const";

export class AttendanceDto {
  @IsNotEmpty({ message: "El evento es obligatorio." })
  eventInstanceId: number;

  @IsNotEmpty({ message: "La modalidad es obligatorio." })
  @IsString({ message: "La modalidad debe ser una cadena de texto." })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(AttendanceModalityEnum, { message: "La modalidad debe ser Presencial o Virtual." })
  @IsIn([AttendanceModalityEnum.PRESENCIAL, AttendanceModalityEnum.VIRTUAL], {
    message: "La modalidad debe ser Presencial o Virtual."
  })
  modality: (typeof AttendanceModalityEnum)[keyof typeof AttendanceModalityEnum];

  @IsNotEmpty({ message: "El responsable es obligatorio." })
  supportId: number;

  @IsOptional()
  coordenates: string | null;

  @IsNotEmpty({ message: "El docente o docentes son obligatorio." })
  @IsArray()
  teacherId: number[];

  @IsNotEmpty({ message: "El estado es obligatorio." })
  @IsString({ message: "El estado debe ser una cadena de texto." })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(AttendanceEnum, { message: "El estado debe ser PRESENTE o AUSENTE." })
  @IsIn([AttendanceEnum.AUSENTE, AttendanceEnum.PRESENTE], {
    message: "El estado debe ser PRESENTE o AUSENTE."
  })
  status: AttendanceEnum;

  @IsOptional()
  comment: string | null;

  @IsOptional()
  justificationUrl: string;
}
