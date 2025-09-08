import { IsNotEmpty, IsOptional } from "class-validator";

export class AttendanceDto {
  @IsNotEmpty({ message: "El evento es obligatorio." })
  eventId: number;

  @IsOptional()
  coordenates?: string;
}
