import { Module } from "@nestjs/common";

import { S3Service } from "@/services/s3.service";
import { ProfileController } from "./profile.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdUserHandler } from "./cqrs/queries/getByIdUser.handler";
import { UploadCvHandler } from "./cqrs/commands/cv/uploadCv.handler";
import { UploadAvatarHandler } from "./cqrs/commands/avatar/uploadAvatar.handler";
import { UploadDuiHandler } from "./cqrs/commands/dui/uploadDui.handler";
import { UploadFileProjection } from "./cqrs/projections/uploadFiles.projection";
import { ProfileService } from "./profile.service";

const ProfileCommandHandlers = [UploadCvHandler, UploadAvatarHandler, UploadDuiHandler];
const ProfileQueryHandlers = [GetByIdUserHandler];

@Module({
  imports: [CqrsModule, JwtModule],

  controllers: [ProfileController],
  providers: [
    S3Service,
    ProfileService,
    UploadFileProjection,
    ...ProfileCommandHandlers,
    ...ProfileQueryHandlers
  ]
})
export class ProfileModule {}
