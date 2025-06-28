import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateToDo, IDeleteToDo, IUpdateToDo } from "../dto/todo.dto";
import { BadRequestException, Logger, Injectable } from "@nestjs/common";
import { ToDo } from "@prisma/client";

@Injectable({})
export class ToDoProjection {
    private readonly logger = new Logger("ToDoProjection");
    constructor(private prisma: PrismaService) { }

    messageError(errorValue: number): string {
        const errorMessage = [`❌ Error de prisma: `, 'Se ha producido un error al procesar su solicitud.']
        return errorMessage[errorValue]
    }

    async create(data: ICreateToDo): Promise<ToDo> {
        try {
            return await this.prisma.toDo.create({ data: { ...data } });
        }
        catch (error) {
            this.logger.error(this.messageError(0), error);
            throw new BadRequestException(this.messageError(1));
        }
    }

    async update(data: IUpdateToDo): Promise<ToDo> {
        const { id, todoName, updatedBy, isComplete } = data;

        try {
            return await this.prisma.toDo.update({ where: { id }, data: { todoName, updatedBy, isComplete } })
        } catch (error) {
            this.logger.error(this.messageError(0), error);
            throw new BadRequestException(this.messageError(1));
        }
    }

    async delete(data: IDeleteToDo): Promise<ToDo> {
        const { id, deletedBy } = data;

        try {
            return await this.prisma.softDelete("toDo", { id }, { deletedBy })
        } catch (error) {
            this.logger.error(this.messageError(0), error);
            throw new BadRequestException(this.messageError(1));
        }
    }
}