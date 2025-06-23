import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UploadFilesDto } from "./dto/profile.dto";

@Injectable()
export class ValidateUploadFilesPipe implements PipeTransform {
  async transform(value: any) {
    const dto = plainToInstance(UploadFilesDto, value);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {}).join(", ")).join(" | ");
      throw new BadRequestException(`Errores de validación: ${messages}`);
    }

    return value; // Devuelve los archivos ya validados
  }
}
