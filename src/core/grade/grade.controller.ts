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

        const s3 = new AWS.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const { Bucket, Key } = this.parseS3Uri(upload.s3uri);

        const fileStream = s3.getObject({ Bucket, Key }).createReadStream();
        try{
            const rows: any[] = [];
            const mapping = upload.mapping as Record<string, string>;
            const cleanMapping = Object.fromEntries(
                Object.entries(mapping).map(([k, v]) => [k.trim(), v.trim()])
            );
            await new Promise<void>((resolve, reject) => {
                fileStream
                    .pipe(csvParser())
                    .on("data", (row) =>{
                        const cleanRow = Object.fromEntries(
                            Object.entries(row).map(([key, value]) => [
                                key.replace(/^\uFEFF/, "").trim(), // elimina BOM
                                typeof value === "string" ? value.trim() : value,
                            ])
                        );
                        rows.push(cleanRow);
                        }
                    )
                    .on("end", () => resolve())
                    .on("error", (err) => reject(err));
            });
            let processed = 0;
            let periodicity;
            console.log('mapping', mapping);
            for (const row of rows) {
                const email = row[mapping.email];
                const score = parseFloat(row[mapping.score]);
                const evaluationInstrumentField = row[cleanMapping.evaluationInstrumentId];
                let evaluationInstrumentId: number | null = null;
                if (evaluationInstrumentField) {

                    if (/^\d+$/.test(evaluationInstrumentField)) {
                        evaluationInstrumentId = parseInt(evaluationInstrumentField);
                    } else {
                        // const foundInstrument = await this.prisma.evaluationInstrument.findFirst({
                        //     where: { code: evaluationInstrumentField },
                        //     select: { id: true },
                        // });
                        // console.log('found instrument --->', foundInstrument.pe);
                        // evaluationInstrumentId = foundInstrument?.id ?? null;
                        const foundInstrument = await this.prisma.evaluationInstrument.findFirst({
                            where: { code: evaluationInstrumentField },
                            select: { id: true, periodicity: true },
                        });

                        if (!foundInstrument) {
                            console.log(`No se encontró instrumento con código ${evaluationInstrumentField}`);
                            continue;
                        }

                        const { id, periodicity:p } = foundInstrument;
                        periodicity = p;
                        evaluationInstrumentId = id;
                    }
                }

                if(evaluationInstrumentId === null){
                    continue;
                }
                evaluationInstrumentId = parseInt(evaluationInstrumentId.toString());
                const evaluationInstrumentDetailId = row[mapping.evaluationInstrumentDetailId]
                console.log('evaluationInstrumentDetailId --> ', evaluationInstrumentDetailId)
                const evaluationNumber = row[mapping.evaluation_number]
                    ? parseInt(row[mapping.evaluation_number])
                    : null;
                if (periodicity?.toLowerCase() === "durante el módulo") {
                    const detail = await this.prisma.evaluationInstrumentDetail.findFirst({
                        where: {
                            evaluationInstrumentId: evaluationInstrumentId,
                            moduleNumber: evaluationInstrumentDetailId ?? 0,
                        },
                        select: { end_date: true },
                    });

                    if (detail?.end_date) {
                        const endDate = new Date(detail.end_date);
                        const limitDate = new Date(endDate);
                        limitDate.setDate(limitDate.getDate() + 14);
                        console.log(`instrumento ${evaluationInstrumentField}`)
                        if (new Date() > limitDate) {
                            console.warn(
                                `Registro bloqueado: ${email} - módulo ${evaluationInstrumentField} venció el ${limitDate.toISOString().split("T")[0]}`
                            );

                        }
                    } else {
                        console.warn(`No se encontró fecha fin de módulo para ${evaluationInstrumentField}`);
                        continue;
                    }
                }
                console.log('to insert ', {
                    email,
                    evaluationInstrumentId,
                    evaluationInstrumentDetailId,
                    score,
                });
                if (!email || isNaN(score)) continue;

                await this.prisma.grade.upsert({
                    where: {
                        email_evaluationInstrumentId_evaluationInstrumentDetailId_numero_evaluacion: {
                            email,
                            evaluationInstrumentId,
                            evaluationInstrumentDetailId: evaluationInstrumentDetailId ?? 0,
                            numero_evaluacion: evaluationNumber ?? 0
                        },
                    },
                    update: { score },
                    create: {
                        email,
                        evaluationInstrumentId,
                        evaluationInstrumentDetailId,
                        score
                    },
                });

                processed++;
            }
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