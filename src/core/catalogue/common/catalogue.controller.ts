import { Controller, Get, Param, Req, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  IDepartmentResponse,
  IMenuItemResponse,
  IMenuItems,
  IPerson,
  IRolePermission
} from "./dto/catalogue.type";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";

import { GetAllDepartmentQuery } from "../../test/coutry/department/cqrs/queries/getAllDepartment.query";
import { GetAllTypePersonQuery } from "./query/typePerson-findMany/getAllTypePerson.query";
import { MenuItem, TypePerson } from "@prisma/client";
import { GetAllPersonQuery } from "./query/person-findMany/getAllPerson.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { NestResponse } from "@/common/helpers/dto";
import { GetAllRolePermissionQuery } from "./query/permission-findMany/getAllRolePermission.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class CatalogueController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get("departments")
  async getAllDepartments(): Promise<IDepartmentResponse> {
    const data = await this.queryBus.execute(new GetAllDepartmentQuery());

    const departmentData = data.map(({ id, name }) => ({ id, name }));
    const municipalityData = data.flatMap(({ Municipality }) =>
      Municipality.map(({ id, name, departmentId }) => ({
        id,
        name,
        departmentId
      }))
    );
    const districtData = data.flatMap(({ Municipality }) =>
      Municipality.flatMap(({ District }) =>
        District.map(({ id, name, municipalityId }) => ({
          id,
          name,
          municipalityId
        }))
      )
    );

    return {
      department: departmentData,
      municipality: municipalityData,
      district: districtData
    };
  }

  @Get("typePersons")
  async getAllTypePerson(): Promise<Pick<TypePerson, "id" | "name">[]> {
    const data = await this.queryBus.execute(new GetAllTypePersonQuery());

    return data;
  }

  @AuthRequired()
  @Get("menuItems")
  async getMenu(@Req() req: Request): Promise<NestResponse<IMenuItemResponse[] | null>> {
    const userWithPermissions = await this.queryBus.execute(
      new GetAllRolePermissionQuery(req["user"].sub)
    );

    const permissions = userWithPermissions!.Role.Permissions;

    const flatMenuItems: MenuItem[] = permissions.flatMap(
      (p: IRolePermission) => p.Permission?.MenuItems.map((m: IMenuItems) => m.Menu) ?? []
    );

    // Eliminar duplicados por id
    const uniqueMenuItems: MenuItem[] = Array.from(
      new Map(flatMenuItems.map((item: MenuItem) => [item!.id, item])).values()
    );

    function buildMenuTree(items: MenuItem[], parentId: number | null = null): IMenuItemResponse[] | [] {
      return items
        .filter((item: MenuItem) => item!.parentId === parentId)
        .map((item: MenuItem) => ({
          ...item,
          children: buildMenuTree(items, item.id)
        }));
    }

    const menuTree = uniqueMenuItems.length > 0 ? buildMenuTree(uniqueMenuItems) : null;

    return { statusCode: 200, message: "Lista de items para el menú.", data: menuTree };
  }

  @AuthRequired()
  @Get("persons/:typePersonId")
  async getAllPerson(@Param("typePersonId") typePersonId: string): Promise<NestResponse<IPerson[]>> {
    const data = await this.queryBus.execute(new GetAllPersonQuery(parseInt(typePersonId)));

    return {
      statusCode: 200,
      message: "Listado de personas",
      data: data
    };
  }
}
