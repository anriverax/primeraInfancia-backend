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
import { UploadAvatarCommand } from "./cqrs/commands/avatar/uploadAvatar.command";
import { NestResponse } from "@/common/helpers/types";
import { UploadFilesDto } from "./dto/profile.dto";
import { ProfileService } from "./profile.service";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";

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
    FileFieldsInterceptor([{ name: "avatar", maxCount: 1 }], { storage: memoryStorage() })
  )
  async upload(
    @UploadedFiles()
    files: UploadFilesDto,
    @Req() req: Request
  ): Promise<NestResponse<boolean>> {
    const { sub } = req["user"] as { sub: number; email: string; role: string };

    const { avatar } = files;

    const user = await this.queryBus.execute(new GetByIdUserQuery(sub));
    if (!user) throw new NotFoundException("El usuario no existe en el sistema.");

    const {
      Person: { dui }
    } = user;

    this.profileService.validateFile(files);

    this.commandBus.execute(
      new UploadAvatarCommand({
        avatar: avatar[0],
        userId: sub,
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
