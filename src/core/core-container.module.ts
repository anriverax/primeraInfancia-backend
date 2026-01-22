import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { GroupModule } from "./group/group.module";

@Module({
  imports: [AuthModule, ProfileModule, GroupModule],
  exports: [AuthModule, ProfileModule, GroupModule]
})
export class CoreContainerModule {}
