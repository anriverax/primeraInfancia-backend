import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

export class RegisterUploadCommand {
    constructor(
        public readonly fileName: string,
        public readonly s3Uri: string,
        public readonly mapping: Record<string, string>,
        public readonly createdBy: string
    ) {}
}

@CommandHandler(RegisterUploadCommand)
export class RegisterUploadHandler implements ICommandHandler<RegisterUploadCommand> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: RegisterUploadCommand): Promise<{ id: number }> {
        const { fileName, s3Uri, mapping, createdBy } = command;

        const upload = await this.prisma.upload.create({
            data: {
                filename: fileName,
                s3uri: s3Uri,
                mapping,
                createdBy: createdBy ?? 'byron',
            },
        });
        console.log('here----------------')
        console.log('here----------------', upload)
        return { id: upload.id };
    }
}
