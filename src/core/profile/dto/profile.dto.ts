import { ArrayNotEmpty, IsArray } from "class-validator";

export class UploadFilesDto {
  @IsArray()
  @ArrayNotEmpty({ message: "Debes subir al menos un archivo pdf." })
  cv: Express.Multer.File[];

  @IsArray()
  @ArrayNotEmpty({ message: "Debes subir al menos un archivo JPG o PNG." })
  images: Express.Multer.File[];

  @IsArray()
  @ArrayNotEmpty({ message: "Debes subir al menos un archivo JPG o PNG." })
  avatar: Express.Multer.File[];
}
