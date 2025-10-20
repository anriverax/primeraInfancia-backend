import { IPaginatedQueryParams } from "@/common/helpers/types";
import { Query } from "@nestjs/cqrs";
import {IGradesWithPagination} from "@/core/grade/dto/grade.type";

export class GetAllGroupPaginationQuery extends Query<IGradesWithPagination> {
    constructor(public readonly data: IPaginatedQueryParams) {
        super();
    }
}
