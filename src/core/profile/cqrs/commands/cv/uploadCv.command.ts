import { Command } from "@nestjs/cqrs";
import { IUploadCv } from "../../../dto/profile.type";

export class UploadCvCommand extends Command<void> {
  constructor(public readonly data: IUploadCv) {
    super();
  }
}
