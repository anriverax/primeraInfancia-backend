import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class PlannedEventInput {
  @IsNotEmpty({ message: "El módulo es obligatorio." })
  trainingModuleId: number;

  @IsNotEmpty({ message: "El evento es obligatorio." })
  eventInstanceId: number;

  @IsNotEmpty({ message: "La fecha es obligatoria." })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  })
  // @MinDate(new Date(), { message: "La fecha no puede ser en el pasado." }) -- activated validation depending on requirements
  start: Date;

  @IsOptional()
  description: string | null;
}

export class PlannedEventTeacherInput {
  @IsNotEmpty({ message: "El evento es obligatorio." })
  plannedEventId: number;

  @IsNotEmpty({ message: "El docente o docentes son obligatorio." })
  @IsArray()
  teacherIds: number[];
}
