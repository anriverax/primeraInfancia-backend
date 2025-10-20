import { AttendanceEnum } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AttendanceDto {
  @IsNotEmpty({ message: "El evento es obligatorio." })
  eventId: number;

  @IsNotEmpty({ message: "El estado es obligatorio." })
  @IsString({ message: "El estado debe ser una cadena de texto." })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(AttendanceEnum, { message: "El estado debe ser PRESENTE o AUSENTE." })
  @IsIn([AttendanceEnum.AUSENTE, AttendanceEnum.PRESENTE], {
    message: "El estado debe ser PRESENTE o AUSENTE."
  })
  status: AttendanceEnum;

  @IsNotEmpty({ message: "El docente o docentes son obligatorio." })
  @IsArray()
  teacherId: number[];

  @IsNotEmpty({ message: "La modalidad es obligatorio." })
  @IsString({ message: "La modalidad debe ser una cadena de texto." })
  @Transform(({ value }) =>
    typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value
  )
  @IsIn(["Presencial", "Virtual"], {
    message: "La modalidad debe ser Presencial o Virtual."
  })
  modality: "Presencial" | "Virtual";

  @IsOptional()
  coordenates: string | null;

  @IsOptional()
  comment: string | null;

  @IsOptional()
  justificationUrl: string;
}
