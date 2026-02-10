import { Command } from "@nestjs/cqrs";
import { IGroupHierarchy } from "../dto/group.type";

export class UploadExcelCommand extends Command<Map<string, IGroupHierarchy>> {
  constructor(
    public readonly excel: Express.Multer.File,
    public readonly userId: number
  ) {
    super();
  }
}
