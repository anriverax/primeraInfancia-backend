import { Module } from "@nestjs/common";
import { TechSupportController } from "./techsupport.controller";

@Module({
  imports: [],

  controllers: [TechSupportController],

  providers: [],
  exports: []
})
export class TechsupportModule {}
