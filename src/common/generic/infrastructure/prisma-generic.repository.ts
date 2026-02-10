import { PrismaService } from "@/services/prisma/prisma.service";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";

export abstract class PrismaGenericRepository<U, V, W> {
  protected abstract modelName: keyof PrismaService;
  constructor(
    protected prisma: PrismaService,
    protected readonly errorHandlingService: ErrorHandlingService
  ) {}
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async findMany<T>(options: {
    where?: U;
    select?: V;
    orderBy?: W;
    skip?: number;
    take?: number;
  }): Promise<T[] | []> {
    try {
      const model: any = this.prisma[this.modelName];
      const results = await model.findMany({
        ...(options.where && { where: options.where }),
        ...(options.select && { select: options.select }),
        ...(options.orderBy && { orderBy: options.orderBy }),
        ...(options.skip && { skip: options.skip }),
        ...(options.take && { take: options.take })
      });

      return results as T[];
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.findMany`, error);
    }
  }

  async findFirst<T>(options: { where?: U; select?: V }): Promise<T | null> {
    try {
      const model: any = this.prisma[this.modelName];
      const result = await model.findFirst({
        ...(options.where && { where: options.where }),
        ...(options.select && { select: options.select })
      });

      return result as T | null;
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.findFirst`, error);
    }
  }

  async findUnique<T>(options: { where?: U; select?: V }): Promise<T | null> {
    try {
      const model: any = this.prisma[this.modelName];
      const result = await model.findUnique({
        ...(options.where && { where: options.where }),
        ...(options.select && { select: options.select })
      });

      return result as T | null;
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.findUnique`, error);
    }
  }

  async update<T, D>(id: number, data: D, select?: V): Promise<T> {
    try {
      const model: any = this.prisma[this.modelName];
      const result = await model.update({
        where: { id },
        data: data,
        ...(select && { select })
      });

      return result as T;
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.update`, error);
    }
  }

  async create<T, D>(data: D, select?: V): Promise<T> {
    try {
      const model: any = this.prisma[this.modelName];
      const result = await model.create({
        data: data,
        ...(select && { select })
      });
      return result as T;
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.create`, error);
    }
  }

  async count(where?: U): Promise<number> {
    try {
      const model: any = this.prisma[this.modelName];
      const count = await model.count({
        ...(where && { where })
      });
      return count;
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.count`, error);
    }
  }

  async softDelete(id: number, deletedBy: number): Promise<void> {
    try {
      await this.prisma.softDelete(this.modelName as any, { id }, { deletedBy });
    } catch (error) {
      this.errorHandlingService.handlePrismaError(`${this.constructor.name}.softDelete`, error);
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
