import { AES, enc } from "crypto-js";
import { BadRequestException, ForbiddenException, Logger } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/* eslint-disable */
export function handlePrismaError(module: string, error: any): never {
  const logger = new Logger(module);
  if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
    throw new ForbiddenException("Este correo electrónico ya está asociado a una cuenta.");
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

export function generateCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function firstCapitalLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
