/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGenericRepository<U = any, V = any, W = any> {
  findMany<T>(options: {
    where?: U;
    select?: V;
    orderBy?: W;
    skip?: number;
    take?: number;
  }): Promise<T[] | []>;

  findFirst<T>(options: { where?: U; select?: V; orderBy?: W }): Promise<T | null>;

  findUnique<T>(options?: { where?: U; select?: V }): Promise<T | null>;

  create<T, D>(data: D, select?: V): Promise<T>;

  update<T, D>(id: number, data: D, select?: V): Promise<T>;

  count(where?: U): Promise<number>;

  softDelete(id: number, deletedBy: number): Promise<void>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
