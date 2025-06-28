import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateToDoCommand } from "./updateToDo.command";
import { ToDoProjection } from "@/core/todo/projections/toDo.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateToDoCommand)
export class UpdateToDoHandler implements ICommandHandler<UpdateToDoCommand> {
    constructor(private readonly projection: ToDoProjection) { }
    async execute(command: UpdateToDoCommand): Promise<NestResponse<void>> {
        const { data } = command;

        await this.projection.update(data);

        return {
            statusCode: 200,
            message: "ToDo actualizado."
        }
    }
}