import { S3Service } from "@/services/s3.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadDuiCommand } from "./uploadDui.command";
import { UploadFileProjection } from "../../projections/uploadFiles.projection";

@CommandHandler(UploadDuiCommand)
export class UploadDuiHandler implements ICommandHandler<UploadDuiCommand> {
  constructor(
    private readonly s3: S3Service,
    private readonly uploadFileProjection: UploadFileProjection
  ) {}

  async execute(command: UploadDuiCommand): Promise<boolean> {
    const { data } = command;
    const { dui, personId, duiImg } = data;

    const result = await Promise.all(
      duiImg.map((img: Express.Multer.File) => this.s3.uploadFile(img, false, dui))
    );

    await this.uploadFileProjection.uploadDui({
      duiName: result,
      personId
    });

    return true;
  }
}
