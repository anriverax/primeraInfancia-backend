import { Injectable } from "@nestjs/common";
import * as argon from "argon2";

@Injectable()
export class PasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return argon.verify(hashedPassword, password);
  }
}
