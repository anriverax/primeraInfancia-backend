// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { CreatePersonCommand } from "./createPerson.command";
// import { PersonProjection } from "../../projections/person.projection";
// import { NestResponse } from "@/common/helpers/dto";
// import { Person } from "@prisma/client";

// @CommandHandler(CreatePersonCommand)
// export class CreatePersonHandler implements ICommandHandler<CreatePersonCommand> {
//   constructor(private readonly personProjection: PersonProjection) {}
//   async execute(command: CreatePersonCommand): Promise<NestResponse<Person>> {
//     const { data } = command;

//     const res = await this.personProjection.create(data);

//     return {
//       statusCode: 201,
//       message: "Persona creada con éxito.",
//       data: res
//     };
//   }
// }
