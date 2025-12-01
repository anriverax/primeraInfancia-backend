import { firstCapitalLetter } from "@/common/helpers/functions";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "prisma/generated/client";

const modelsWithSoftDelete = [
  "Group",
  "GroupLeader",
  "PersonRole",
  "MentorAssignment",
  "Section",
  "Question",
  "Answer",
  "SurveyData"
];

// We'll apply $extends to the instance created in the constructor so the adapter is used.

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(_env: ConfigService) {
    const connectionString = _env.get<string>("database.url");
    const adapter = new PrismaPg({ connectionString });

    super({
      adapter
    });

    const extended = this.$extends({
      result: {
        person: {
          fullName: {
            needs: { firstName: true, lastName1: true, lastName2: true },
            compute(person) {
              return `${person.firstName} ${person.lastName1} ${person.lastName2}`;
            }
          }
        }
      },
      query: {
        $allModels: {
          $allOperations({ model, operation, args, query }) {
            const operationsToFilter = [
              "findUnique",
              "findFirst",
              "findMany",
              "count",
              "aggregate",
              "groupBy"
            ];

            if (modelsWithSoftDelete.includes(model) && operationsToFilter.includes(operation)) {
              if (typeof args === "object" && args !== null) {
                args["where"] ??= {};

                if (!("deletedAt" in args["where"])) {
                  args["where"].deletedAt = null;
                }
              }
            }

            return query(args);
          },
          async update({ model, args, query }) {
            if (modelsWithSoftDelete.includes(model)) {
              if (
                typeof args === "object" &&
                args !== null &&
                "where" in args &&
                typeof args.where === "object"
              ) {
                args.where = args.where ?? {};

                if (!("deletedAt" in args.where)) {
                  args.where["deletedAt"] = null;
                }
              }
            }

            return query(args);
          }
        }
      }
    });

    Object.assign(this, extended);
  }

  /* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type */
  async softDelete<T extends keyof PrismaClient>(
    modelName: T,
    where: Prisma.Args<PrismaClient[T], "update">["where"],
    additionalData?: Prisma.Args<PrismaClient[T], "update">["data"]
  ) {
    if (typeof this[modelName] !== "object" || typeof (this[modelName] as any).update !== "function") {
      throw new Error(
        `El modelo ${String(modelName)} no se encuentra o no admite operaciones de actualización.`
      );
    }

    if (!modelsWithSoftDelete.includes(firstCapitalLetter(String(modelName)))) {
      throw new Error(`El modelo ${String(modelName)} no soporta soft deletion.`);
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error(`Falta la cláusula «where» o no es válida para ${String(modelName)}.`);
    }

    const data = {
      ...additionalData,
      deletedAt: new Date()
    };

    return (this[modelName] as any).update({ where, data });
  }

  /* eslint-enable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type */
}
