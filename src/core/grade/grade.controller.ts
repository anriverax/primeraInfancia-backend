import {Body, Controller, Get, NotFoundException, Post, Query} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {PaginationDto} from "@/common/helpers/dto";
import {NestResponseWithPagination} from "@/common/helpers/types";
import {AuthRequired} from "@/common/decorators/authRequired.decorator";
import {GetAllGradesPaginationQuery} from "@/core/grade/queries/get-all-grades-pagination";
import {IGrade} from "@/core/grade/dto/grade.type";
import {RegisterUploadCommand} from "@/core/upload/commands/registerUpload.command";
import {PrismaService} from "@/services/prisma/prisma.service";
import * as AWS from "aws-sdk";
import * as process from "node:process";
import * as csvParser from "csv-parser";
@Controller()
export class GradeController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly prisma: PrismaService
    ) {}
    parseS3Uri(s3Uri: string) {
        const match = s3Uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
        if (!match) throw new Error("URI S3 inválido");
        return { Bucket: match[1], Key: match[2] };
    }
    @AuthRequired()
    @Post("process-upload")
    async processUpload(@Body("uploadId") uploadId: number) {
        const upload = await this.prisma.upload.findUnique({ where: { id: uploadId } });
        if (!upload) throw new NotFoundException("Upload no encontrado");

        console.log('before');
        const s3 = new AWS.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const { Bucket, Key } = this.parseS3Uri(upload.s3uri);

        console.log('after',Bucket);
        console.log('key',Key);
        console.log('uri',upload.s3uri);
        const fileStream = s3.getObject({ Bucket, Key }).createReadStream();
        console.log('after2');
        try{
            const rows: any[] = [];
            const mapping = upload.mapping as Record<string, string>;
            console.log('after3');
            await new Promise<void>((resolve, reject) => {
                fileStream
                    .pipe(csvParser())
                    .on("data", (row) => rows.push(row))
                    .on("end", () => resolve())
                    .on("error", (err) => reject(err));
            });
            let processed = 0;
            console.log('after4 ---> ',rows);
            for (const row of rows) {
                console.log('row is ', row);
                console.log('mapping', mapping);
                const email = row[mapping.email];
                const score = parseFloat(row[mapping.score]);
                const evaluationInstrumentId = parseInt(row[mapping.evaluationInstrumentId]);
                const evaluationInstrumentDetailId = row[mapping.evaluationInstrumentDetailId]
                    ? parseInt(row[mapping.evaluationInstrumentDetailId])
                    : null;

                console.log('to create --------', {
                    email,
                    evaluationInstrumentId,
                    evaluationInstrumentDetailId,
                    score,
                });
                if (!email || isNaN(score)) continue;

                await this.prisma.grade.upsert({
                    where: {
                        email_evaluationInstrumentId_evaluationInstrumentDetailId: {
                            email,
                            evaluationInstrumentId,
                            evaluationInstrumentDetailId: evaluationInstrumentDetailId ?? 0,
                        },
                    },
                    update: { score },
                    create: {
                        email,
                        evaluationInstrumentId,
                        evaluationInstrumentDetailId,
                        score,
                    },
                });

                processed++;
            }
            console.log('after5');
            await this.prisma.upload.update({
                where: { id: uploadId },
                data: { status: "PROCESSED" },
            });
        }catch (e){
            console.log('error --> ', e)
        }


        return { message: "Archivo procesado correctamente" };
    }
    @AuthRequired()
    @Post("upload")
    async register(
        @Body()
        body: {
            filename: string;
            s3uri: string;
            mapping: Record<string, string>;
            userEmail: string;
        }
    ) {
        console.log('here body', body);
        const { filename, s3uri, mapping, userEmail } = body;

        const result = await this.commandBus.execute(
            new RegisterUploadCommand(filename, s3uri, mapping, userEmail)
        );

        return {
            statusCode: 201,
            message: "Archivo registrado correctamente",
            data: result,
        };
    }
    @AuthRequired()
    @Get("all")
    async getAll(@Query() filterPagination: PaginationDto): Promise<NestResponseWithPagination<IGrade[]>> {
        const result = await this.queryBus.execute(new GetAllGradesPaginationQuery(filterPagination));
        return {
            statusCode: 200,
            message: "Grades",
            data: result.data,
            meta: result.meta
        };
    }
}