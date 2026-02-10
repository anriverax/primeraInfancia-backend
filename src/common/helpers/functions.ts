import { AES, enc } from "crypto-js";
import { BadRequestException, ForbiddenException, Logger } from "@nestjs/common";

import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { RecordStatus } from "./const";

/* eslint-disable */
export function handlePrismaError(module: string, error: any): never {
  const logger = new Logger(module);
  if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
    if ((error.meta?.target as any).find((field: string) => field === "dui"))
      throw new ForbiddenException("DUI ya está asociado a una cuenta.");
    else throw new ForbiddenException("Este correo electrónico ya está asociado a una cuenta.");
  }

  // Log or handle other Prisma errors appropriately
  logger.error(`❌ Error de prisma: `, error);
  throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
}

export function decryptTextTransformer(value: string): string {
  if (process.env.PLAIN_TEXT) {
    try {
      const result = AES.decrypt(value, process.env.PLAIN_TEXT);
      return result.toString(enc.Utf8);
    } catch (error) {
      throw new Error("Error de descifrado: " + error.message);
    }
  }

  throw new Error("El descifrado no está habilitado.");
}

export function calculateDUIVerification(eightDigits: string): number {
  const weights = [9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    sum += parseInt(eightDigits[i]) * weights[i];
  }

  const remainder = sum % 9;
  return remainder === 0 ? 0 : 9 - remainder;
}

export function firstCapitalLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatForFrontend(isoDateString: Date) {
  if (!isoDateString) return "-";

  const jsDate = new Date(isoDateString);

  const day = String(jsDate.getDate()).padStart(2, "0");
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const year = jsDate.getFullYear();

  let hours = jsDate.getHours();
  const minutes = String(jsDate.getMinutes()).padStart(2, "0");
  const isPM = hours >= 12;
  const suffix = isPM ? "p.m." : "a.m.";

  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}, ${hh}:${minutes} ${suffix}`;
}

export function getPrivateKey(configService: ConfigService): string {
  if (process.env.NODE_ENV === "development")
    return fs.readFileSync(process.env.JWT_PRIVATE_KEY!, "utf8");

  const privateKey =
    configService.get<string>("jwt.privateKey") ||
    fs.readFileSync(configService.get<string>("jwt.privateKey")!, "utf8");

  return privateKey;
}

export function getPublicKey(configService: ConfigService): string {
  if (process.env.NODE_ENV === "development")
    return fs.readFileSync(process.env.JWT_PUBLIC_KEY!, "utf8");

  const publicKey =
    configService.get<string>("jwt.publicKey") ||
    fs.readFileSync(configService.get<string>("jwt.publicKey")!, "utf8");

  return publicKey;
}

export function stringsToJson(arr: string[]): Record<string, any> {
  return arr.reduce(
    (obj: Record<string, any>, key) => {
      obj[key] = true;
      return obj;
    },
    {} as Record<string, any>
  );
}

export const getRecordStatus = (deletedAt: Date | null): RecordStatus => {
  return deletedAt === null ? RecordStatus.ACTIVE : RecordStatus.DROPPED;
};
