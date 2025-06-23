import { S3Service } from "@/services/s3.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadCvCommand } from "./uploadCv.command";
import { UploadFileProjection } from "../../projections/uploadFiles.projection";

@CommandHandler(UploadCvCommand)
export class UploadCvHandler implements ICommandHandler<UploadCvCommand> {
  constructor(
    private readonly s3: S3Service,
    private readonly projection: UploadFileProjection
  ) {}

  async execute(command: UploadCvCommand): Promise<void> {
    const { data } = command;
    const { cv, academicId, dui } = data;

    const result = await this.s3.uploadFile(
      cv,
      false, // isBase64
      dui
    );

    await this.projection.uploadCv({
      cvName: result,
      academicId
    });
  }
}
