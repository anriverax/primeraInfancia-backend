import { Controller, Get, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { IDepartmentResponse, ITypePerson } from "./dto/catalogue.type";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { GetAllTypePersonQuery } from "./query/getAllTypePerson.query";
import { GetAllDepartmentQuery } from "../coutry/department/cqrs/queries/getAllDepartment.query";

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
  async getAllTypePerson(): Promise<ITypePerson[]> {
    const data = await this.queryBus.execute(new GetAllTypePersonQuery());

    return data;
  }
}
