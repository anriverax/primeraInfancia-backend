import { EventsHandler } from "@nestjs/cqrs";
import { UserRegisteredEvent } from "./userRegistered.event";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor() {}
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;
    console.log("UserRegisteredEvent handled for user:", payload.email);
    // await this.authService.sendVerificationEmail(payload.email, payload.passwd);
  }
}
