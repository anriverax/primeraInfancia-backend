import { S3Service } from "@/services/s3.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadAvatarCommand } from "./uploadAvatar.command";
import { UploadFileProjection } from "../../projections/uploadFiles.projection";

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarHandler implements ICommandHandler<UploadAvatarCommand> {
  constructor(
    private readonly s3: S3Service,
    private readonly projection: UploadFileProjection
  ) {}

  async execute(command: UploadAvatarCommand): Promise<boolean> {
    const { data } = command;
    const { avatar, userId, dui } = data;

    const result = await this.s3.uploadFile(
      avatar,
      false, // isBase64
      dui
    );

    await this.projection.uploadAvatar({
      avatar: result,
      userId
    });

    return true;
  }
}
