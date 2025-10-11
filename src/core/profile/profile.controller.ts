import {
  Controller,
  NotFoundException,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseInterceptors
} from "@nestjs/common";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetByIdUserQuery } from "./cqrs/queries/getByIdUser.query";
// import { UploadCvCommand } from "./cqrs/commands/cv/uploadCv.command";
import { UploadAvatarCommand } from "./cqrs/commands/avatar/uploadAvatar.command";
import { UploadDuiCommand } from "./cqrs/commands/dui/uploadDui.command";
import { NestResponse } from "@/common/helpers/types";
import { UploadFilesDto } from "./dto/profile.dto";
import { ProfileService } from "./profile.service";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { UploadCvCommand } from "./cqrs/commands/cv/uploadCv.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly profileService: ProfileService
  ) {}

  @AuthRequired()
  @Post("uploadFiles")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "cv", maxCount: 1 },
        { name: "images", maxCount: 2 }, // Up to 2 images
        { name: "avatar", maxCount: 1 }
      ],
      { storage: memoryStorage() }
    )
  )
  async upload(
    @UploadedFiles()
    files: UploadFilesDto,
    @Req() req: Request
  ): Promise<NestResponse<boolean>> {
    const { sub } = req["user"] as { sub: number; email: string; role: string };

    const { cv, avatar, images } = files;

    const user = await this.queryBus.execute(new GetByIdUserQuery(sub));
    if (!user) throw new NotFoundException("El usuario no existe en el sistema.");

    const {
      Person: { dui }
    } = user;

    this.profileService.validateFile(files);

    this.commandBus.execute(
      new UploadCvCommand({
        cv: cv[0],
        dui
      })
    );
    this.commandBus.execute(
      new UploadAvatarCommand({
        avatar: avatar[0],
        userId: sub,
        dui
      })
    );
    this.commandBus.execute(
      new UploadDuiCommand({
        duiImg: images,
        personId: user.Person.id,
        dui
      })
    );

    return {
      statusCode: 200,
      message: "¡Todos los documentos se han subido exitosamente!",
      data: true
    };
  }
}
