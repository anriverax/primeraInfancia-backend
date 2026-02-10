import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Req } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { GetAllMenuPermissionQuery } from "../application/queries/getAll-menuPermission.query";
import { IMenuPermission } from "../application/dto/menuPermission.type";

@Controller("/catalogue")
export class CatalogueController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get("menuPermission")
  async getAllMenuPermission(@Req() req: Request): Promise<IMenuPermission[] | []> {
    const { id } = req.authenticatedUser!;

    return this.queryBus.execute(new GetAllMenuPermissionQuery(id));
  }
}
