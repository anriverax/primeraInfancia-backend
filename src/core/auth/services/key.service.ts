import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllUserKeyByUserIdQuery } from "../cqrs/queries/userKey/findMany/getAllUserKeyByUserId.query";
import { GetByUserIdUserKeyQuery } from "../cqrs/queries/userKey/findFirst/getByUserIdUserKey.query";
import { UserKeyProjection } from "../cqrs/projections/userkey.projection";

@Injectable()
export class KeyService {
  constructor(
    private readonly config: ConfigService,
    private readonly queryBus: QueryBus,
    private readonly projection: UserKeyProjection
  ) {}
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    });
    return { publicKey, privateKey };
  }

  encryptPrivateKey(privateKey: string): string {
    const key = Buffer.from(this.config.get<string>("privatekeySecret")!, "hex"); // Debe ser de 32 bytes para aes-256-cbc
    const iv = crypto.randomBytes(16); // IV de 16 bytes para aes-256-cbc
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(privateKey, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decryptPrivateKey(encrypted: string): string {
    const key = Buffer.from(this.config.get<string>("privatekeySecret")!, "hex");
    const [ivHex, encryptedHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedData = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString("utf8");
  }

  async rotateUserKey(userId: number): Promise<void> {
    await this.projection.updateMany(userId);

    const { publicKey, privateKey } = this.generateKeyPair();
    const encryptedPrivateKey = this.encryptPrivateKey(privateKey);

    await this.projection.create({
      userId,
      publicKey,
      privateKey: encryptedPrivateKey
    });
  }

  async revokeKey(keyId: number): Promise<void> {
    await this.projection.update(keyId);
  }

  async verifySignature(userId: number, data: string, signature: string): Promise<boolean> {
    const userKeys = await this.queryBus.execute(new GetAllUserKeyByUserIdQuery(userId));

    for (const key of userKeys) {
      const isValid = crypto
        .createVerify("SHA256")
        .update(data)
        .verify(key.publicKey, signature, "base64");

      if (isValid) return true;
    }

    return false;
  }

  async signData(userId: number, data: string): Promise<string> {
    const key = await this.queryBus.execute(new GetByUserIdUserKeyQuery(userId));

    if (!key) throw new Error("No active key found");

    const privateKey = this.decryptPrivateKey(key.privateKey);

    const sign = crypto.createSign("SHA256");
    sign.update(data);

    return sign.sign(privateKey, "base64");
  }
}
