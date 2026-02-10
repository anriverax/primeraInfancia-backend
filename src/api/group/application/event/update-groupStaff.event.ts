export class UpdateGroupStaffEvent {
  constructor(
    public readonly id: number,
    public readonly data: {
      personId: number;
      predecessorPersonId?: number | null;
      updatedBy: number;
      parentId?: number | null;
    }
  ) {}
}
