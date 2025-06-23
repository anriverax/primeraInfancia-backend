import { BadRequestException, Injectable } from "@nestjs/common";
import { IFile } from "./dto/profile.type";

@Injectable({})
export class ProfileService {
  constructor() {}

  validateFile(files: IFile): void {
    const { cv, avatar, images } = files;
    const msg: string[] = [];

    if (!cv || cv.length === 0) msg.push("Debes subir tu cv en formato PDF.");
    else if (cv.length > 1) msg.push("Solo se permite un archivo de CV.");
    if (cv && cv[0].mimetype !== "application/pdf") msg.push("El CV debe estar en formato PDF.");

    if (!images || images.length === 0)
      msg.push("Debes subir tú DUI, reves y derecho en formato JPG o PNG.");
    else if (images.length > 2) msg.push("Solo se permiten 2 imágenes.");
    if (images) {
      images.forEach((img) => {
        if (!["image/jpeg", "image/png"].includes(img.mimetype))
          msg.push("El DUI tiene que estar en formato JPG o PNG.");
      });
    }
    if (!avatar || avatar.length === 0) msg.push("Debes subir el avatar en formato JPG o PNG.");
    else if (avatar.length > 1) msg.push("Solo se permite un avatar.");
    if (avatar && !["image/jpeg", "image/png"].includes(avatar[0].mimetype))
      msg.push("El avatar debe ser JPG o PNG.");

    if (msg.length > 0) {
      throw new BadRequestException(msg);
    }
  }
}
