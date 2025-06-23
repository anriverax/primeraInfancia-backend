import { EventsHandler } from "@nestjs/cqrs";
import { AuthService } from "../../../services/auth.service";
import { UserRegisteredEvent } from "./userRegistered.event";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor(private readonly authService: AuthService) {}
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;

    await this.authService.sendVerificationEmail(payload.email, payload.passwd);
  }
}
