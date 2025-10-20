import {CqrsModule} from "@nestjs/cqrs";
import {UploadController} from "@/core/upload/upload.controller";
import {PrismaService} from "@/services/prisma/prisma.service";
import {RegisterUploadHandler} from "@/core/upload/commands/registerUpload.command";
import {Module} from "@nestjs/common";

@Module({
    imports: [CqrsModule],
    controllers: [UploadController],
    providers: [PrismaService, RegisterUploadHandler],
    exports: [RegisterUploadHandler]
})
export class UploadModule {}