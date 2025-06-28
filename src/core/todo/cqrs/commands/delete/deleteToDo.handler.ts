import { NestResponse } from "@/common/helpers/dto";
import { ToDoProjection } from "@/core/todo/projections/toDo.projection";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteToDoCommand } from "./deleteToDo.command";

@CommandHandler(DeleteToDoCommand)
export class DeleteTodoHandler implements ICommandHandler<DeleteToDoCommand> {
    constructor(private readonly projection: ToDoProjection) { }
    async execute(command: DeleteToDoCommand): Promise<NestResponse<void>> {
        const { data } = command;
        await this.projection.delete(data);

        return {
            statusCode: 200,
            message: "ToDo eliminado."
        }
    }
}