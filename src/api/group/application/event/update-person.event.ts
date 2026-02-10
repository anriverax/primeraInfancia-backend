export class UpdatePersonEvent {
  constructor(
    public readonly id: number,
    public readonly data: {
      typePersonId: number;
      updatedBy: number;
    }
  ) {}
}
