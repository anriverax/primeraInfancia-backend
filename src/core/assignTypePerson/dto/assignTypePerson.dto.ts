import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class AssignTypePersonDto {
  @IsNotEmpty({ message: "El formador es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el formador." })
  trainerId: number;
  @IsNotEmpty({ message: "El grupo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  groupId: number;
}

export class AddParticipantDto {
  @IsNotEmpty({ message: "El grupo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  groupId: number;

  @IsNotEmpty({ message: "El tipo de persona es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  typePersonId: number;

  @IsNotEmpty({ message: "La zona es es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  zoneId: number;

  @IsNotEmpty({ message: "La zona es es obligatorio." })
  @IsNumber()
  @Min(1, { message: "Debe seleccionar una opción válida para el grupo." })
  memberCount: number;
}
