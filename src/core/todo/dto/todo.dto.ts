import { ToDo } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class TodoDto {
    @IsNotEmpty({ message: "Campo obligatorio" })
    @IsString({ message: "Completar como cadena de texto" })
    @Transform(({ value }) => value.trim())
    todoName: string
}

export type ICreateTodo = Pick<ToDo, "todoName" | "createdBy">;
export type IUpdateTodo = Pick<Todo, "id", "todoName" | "updatedBy">;
export type IDeleteTodo = Pick<Todo, "id" | "deletedBy">;
export type IGetTodo = Pick<ToDo, "id" | "todoName" | "isComplete">;