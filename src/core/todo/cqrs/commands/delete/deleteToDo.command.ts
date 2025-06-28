import { NestResponse } from "@/common/helpers/dto";
import { IDeleteToDo } from "@/core/todo/dto/todo.dto";
import { Command } from "@nestjs/cqrs";

export class DeleteToDoCommand extends Command<NestResponse<void>> {
    constructor(public readonly data: IDeleteToDo) {
        super();
    }
}