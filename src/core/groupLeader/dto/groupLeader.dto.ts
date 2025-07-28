import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class GroupLeaderDto {
  @IsNotEmpty({ message: "El formador es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el formador." })
  trainerId: number;
  @IsNotEmpty({ message: "El grupo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  groupId: number;
}
