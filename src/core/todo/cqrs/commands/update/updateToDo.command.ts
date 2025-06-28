import { NestResponse } from "@/common/helpers/dto";
import { IUpdateToDo } from "@/core/todo/dto/todo.dto";
import { Command } from "@nestjs/cqrs";


export class UpdateToDoCommand extends Command<NestResponse<void>> {
    constructor(public readonly data: IUpdateToDo) {
        super();
    }
}