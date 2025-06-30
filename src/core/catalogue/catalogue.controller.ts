import { Controller, Get, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { IDepartmentResponse, IPerson } from "./dto/catalogue.type";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";

import { GetAllDepartmentQuery } from "../coutry/department/cqrs/queries/getAllDepartment.query";
import { GetAllTypePersonQuery } from "./query/typePerson-findMany/getAllTypePerson.query";
import { TypePerson } from "@prisma/client";
import { GetAllPersonQuery } from "./query/person-findMany/getAllPerson.query";
import { AuthRequired } from "@/services/jwt/decorators/authRequired.decorator";
import { NestResponse } from "@/common/helpers/dto";

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
  @Get("persons")
  async getAllPerson(): Promise<NestResponse<IPerson[]>> {
    const data = await this.queryBus.execute(new GetAllPersonQuery());

    return {
      statusCode: 200,
      message: "Listado de personas",
      data: data
    };
  }
}
