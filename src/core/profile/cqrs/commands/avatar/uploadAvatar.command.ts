import { Command } from "@nestjs/cqrs";
import { IUploadAvatar } from "../../../dto/profile.type";

export class UploadAvatarCommand extends Command<boolean> {
  constructor(public readonly data: IUploadAvatar) {
    super();
  }
}
