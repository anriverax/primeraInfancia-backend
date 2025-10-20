import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

export class UploadGradesCommand {
    constructor(
        public readonly grades: Array<{
            email: string;
            evaluationInstrumentId: number;
            evaluationInstrumentDetailId?: number;
            score: number;
        }>
    ) {}
}

@CommandHandler(UploadGradesCommand)
export class UploadGradesHandler implements ICommandHandler<UploadGradesCommand> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: UploadGradesCommand) {
        const { grades } = command;

        const created = await this.prisma.$transaction(async (tx) => {
            for (const g of grades) {
                await tx.grade.upsert({
                    where: {
                        email_evaluationInstrumentId_evaluationInstrumentDetailId: {
                            email: g.email,
                            evaluationInstrumentId: g.evaluationInstrumentId,
                            evaluationInstrumentDetailId: g.evaluationInstrumentDetailId ?? 0,
                        },
                    },
                    update: { score: g.score },
                    create: {
                        email: g.email,
                        evaluationInstrumentId: g.evaluationInstrumentId,
                        evaluationInstrumentDetailId: g.evaluationInstrumentDetailId ?? 0,
                        score: g.score,
                    },
                });
            }
            return grades.length;
        });

        return { count: created };
    }
}
