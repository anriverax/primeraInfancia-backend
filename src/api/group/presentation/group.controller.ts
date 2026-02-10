import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllDepartmentWithGroupsQuery } from "../application/queries/getAll-department-with-groups.query";
import { IGroupHierarchy, IGroupListResponse } from "../application/dto/group.type";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Request } from "express";
import { UploadExcelCommand } from "../application/command/upload-excel.command";
import { UploadFileDto } from "../application/dto/group.dto";
import { FindManyTeachersByUserIdQuery } from "../application/queries/findMany-teachers-byUserId.query";
import { NestResponse } from "@/common/helpers/types";
@Controller("/group")
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Get()
  async GetAll(): Promise<IGroupListResponse[]> {
    const groups = await this.queryBus.execute(new GetAllDepartmentWithGroupsQuery());
    return groups;
  }

  @AuthRequired()
  @Post("/uploadFile")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "excel", maxCount: 1 } // ✅ Campo Excel agregado
      ],
      { storage: memoryStorage() }
    )
  )
  massGroupDistribution(
    @UploadedFiles()
    files: UploadFileDto,
    @Req() req: Request
  ): Promise<Map<string, IGroupHierarchy>> {
    const { id } = req.authenticatedUser!;

    const validMimeTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ];

    if (!validMimeTypes.includes(files.excel[0].mimetype)) {
      throw new BadRequestException("El archivo debe ser .xls, .xlsx o .csv");
    }

    const result = this.commandBus.execute(new UploadExcelCommand(files.excel[0], id));
    return result;
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  @AuthRequired()
  @Get("byTypePerson")
  async getByTypePerson(@Req() req: Request): Promise<NestResponse<any[]>> {
    const { id } = req.authenticatedUser!;

    const result = await this.queryBus.execute(new FindManyTeachersByUserIdQuery(Number(id)));

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: result
    };
  }
}
