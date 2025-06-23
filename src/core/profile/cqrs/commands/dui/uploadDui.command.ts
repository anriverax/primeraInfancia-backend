import { Command } from "@nestjs/cqrs";
import { IUploadDui } from "../../../dto/profile.type";

export class UploadDuiCommand extends Command<boolean> {
  constructor(public readonly data: IUploadDui) {
    super();
  }
}
