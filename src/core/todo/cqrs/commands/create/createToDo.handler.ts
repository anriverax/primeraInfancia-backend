import { ICommandHandler } from "@nestjs/cqrs";
import { CreateToDoCommand } from "./createToDo.command";
import { ToDoProjection } from "@/core/todo/projections/toDo.projection";
import { NestResponse } from "@/common/helpers/dto";
import { ToDo } from "@prisma/client";

export class CreateToDoHandler implements ICommandHandler<CreateToDoCommand> {
    constructor(private readonly projection: ToDoProjection) { }
    async execute(command: CreateToDoCommand): Promise<NestResponse<ToDo>> {
        const { data } = command;

        const res = await this.projection.create(data);

        return {
            statusCode: 201,
            message: "ToDo creado",
            data: res
        };
    }
}