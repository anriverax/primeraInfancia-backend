import { IsArray } from "class-validator";

export class UploadFileDto {
  @IsArray()
  excel: Express.Multer.File[];
}
