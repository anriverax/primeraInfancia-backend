import { BadRequestException, Injectable } from "@nestjs/common";
import { IFile } from "./dto/profile.type";

@Injectable({})
export class ProfileService {
  constructor() {}

  validateFile(files: IFile): void {
    const { avatar } = files;
    const msg: string[] = [];

    if (!avatar || avatar.length === 0) msg.push("Debes subir el avatar en formato JPG o PNG.");
    else if (avatar.length > 1) msg.push("Solo se permite un avatar.");
    if (avatar && !["image/jpeg", "image/png"].includes(avatar[0].mimetype))
      msg.push("El avatar debe ser JPG o PNG.");

    if (msg.length > 0) {
      throw new BadRequestException(msg);
    }
  }
}
