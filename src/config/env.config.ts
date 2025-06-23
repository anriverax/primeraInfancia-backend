import { plainToClass } from "class-transformer";
import { IsAlphanumeric, IsEnum, IsNumber, validateSync, IsString } from "class-validator";

enum EnvType {
  Dev = "development",
  Prod = "production"
}

class EnvVariables {
  @IsEnum(EnvType)
  NODE_ENV: EnvType;

  @IsNumber()
  PORT: number;

  @IsString()
  REDIS: string;

  /* POSTGRESQL */
  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsAlphanumeric()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsAlphanumeric()
  POSTGRES_HOST: string;

  // DATABASE_URL is optional

  /* JWT */
  @IsString()
  JWT_EXPIRATION: string;

  @IsString()
  JWT_REFRESH_TOKEN: string;

  @IsString()
  JWT_PRIVATE_KEY_PATH: string;

  @IsString()
  JWT_PUBLIC_KEY_PATH: string;

  // PLAIN_TEXT is optional
  @IsString()
  RESEND: string;

  @IsString()
  PRIVATE_KEY_SECRET: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  AWS_S3_BUCKET: string;

  @IsString()
  AWS_URL: string;
}

export function validate(configuration: Record<string, unknown>): EnvVariables {
  const finalConfig = plainToClass(EnvVariables, configuration, { enableImplicitConversion: true });
  const errors = validateSync(finalConfig, { skipMissingProperties: true });

  if (errors.length > 0) throw new Error(errors.toString());

  return finalConfig;
}
