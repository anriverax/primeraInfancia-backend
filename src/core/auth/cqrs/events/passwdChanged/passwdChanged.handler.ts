import { EventsHandler } from "@nestjs/cqrs";
import { AuthService } from "../../../services/auth.service";
import { PasswdChangedEvent } from "./passwdChanged.event";

@EventsHandler(PasswdChangedEvent)
export class PasswdChangedHandler {
  constructor(private readonly authService: AuthService) {}
  async handle(event: PasswdChangedEvent): Promise<void> {
    await this.authService.sendChangePasswd(event.email);
  }
}
