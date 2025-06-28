import { ToDo } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class TodoDto {
    @IsNotEmpty({ message: "Campo obligatorio" })
    @IsString({ message: "Completar como cadena de texto" })
    @Transform(({ value }) => value.trim())
    todoName: string
}

export type ICreateToDo = Pick<ToDo, "todoName" | "createdBy">;
//export type IUpdateToDo = Pick<ToDo, "id", "todoName" | "isComplete" | "updatedBy">;
export type IUpdateToDo = Pick<ToDo, "id" | "todoName" | "updatedBy" | "isComplete">;
export type IDeleteToDo = Pick<ToDo, "id" | "deletedBy">;
export type IGetToDo = Pick<ToDo, "id" | "todoName" | "isComplete">;