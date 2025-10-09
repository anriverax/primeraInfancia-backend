import { TrainingModule } from "@prisma/client";

// Representa un único módulo de formación. El array se maneja en los consumidores
export type IGetAllTrainingModule = Pick<
  TrainingModule,
  "id" | "name" | "title" | "startDate" | "endDate" | "hours"
>;
