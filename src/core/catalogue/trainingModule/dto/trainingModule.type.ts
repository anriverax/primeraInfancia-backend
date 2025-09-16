import { TrainingModule } from "@prisma/client";

export type IGetAllTrainingModule = Pick<TrainingModule, "id" | "name">;
