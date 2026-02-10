import { Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { IPasswordHasher } from "../../domain/ports/security/password-hasher.port";

@Injectable()
export class ArgonPasswordHasher implements IPasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return argon.verify(hash, password);
  }
}
