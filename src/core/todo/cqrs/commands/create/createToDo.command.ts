import { NestResponse } from "@/common/helpers/dto";
import { ICreateToDo } from "@/core/todo/dto/todo.dto";
import { Command } from "@nestjs/cqrs";
import { ToDo } from "@prisma/client";

export class CreateToDoCommand extends Command<NestResponse<ToDo>> {
    constructor(public readonly data: ICreateToDo) {
        super();
        
    }
}