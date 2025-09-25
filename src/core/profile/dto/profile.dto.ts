import { ArrayNotEmpty, IsArray } from "class-validator";

export class UploadFilesDto {
  @IsArray()
  @ArrayNotEmpty({ message: "Debes subir al menos un archivo JPG o PNG." })
  avatar: Express.Multer.File[];
}
