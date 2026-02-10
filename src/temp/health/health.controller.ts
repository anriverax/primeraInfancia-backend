import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check(): { status: "ok 2" } {
    return { status: "ok 2" };
  }
}
