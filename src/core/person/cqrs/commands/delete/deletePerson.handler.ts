// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { DeletePersonCommand } from "./deletePerson.command";
// import { PersonProjection } from "../../projections/person.projection";
// import { NestResponse } from "@/common/helpers/dto";

// @CommandHandler(DeletePersonCommand)
// export class DeletePersonHandler implements ICommandHandler<DeletePersonCommand> {
//   constructor(private readonly personProjection: PersonProjection) {}
//   async execute(command: DeletePersonCommand): Promise<NestResponse<void>> {
//     const { data } = command;

//     await this.personProjection.delete(data);

//     return {
//       statusCode: 200,
//       message: "Persona eliminada con éxito."
//     };
//   }
// }
