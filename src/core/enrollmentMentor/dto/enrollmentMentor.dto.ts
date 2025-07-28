import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class EnrollmentMentorDto {
  @IsNotEmpty({ message: "La inscripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  enrollmentId: number;

  @IsNotEmpty({ message: "La inscripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  mentorId: number;
}

export class EnrollmentMentorPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
