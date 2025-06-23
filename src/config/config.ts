interface IEnv {
  nodeEnv: string | undefined;
  port: number;
  database: {
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    name: string | undefined;
    url: string | undefined;
  };
  jwt: {
    expiration: string | undefined;
    refreshToken: string | undefined;
    refreshSecret: string | undefined;
    privateKey: string | undefined;
    publicKey: string | undefined;
  };
  redis: string | undefined;
  resend: string | undefined;
  privatekeySecret: string | undefined;
  aws: {
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    region: string | undefined;
    bucketName: string | undefined;
    url: string | undefined;
  };
}

export default (): IEnv => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || "3001"),
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    url: process.env.DATABASE_URL
  },
  jwt: {
    expiration: process.env.JWT_EXPIRATION,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    privateKey: process.env.JWT_PRIVATE_KEY_PATH,
    publicKey: process.env.JWT_PUBLIC_KEY_PATH
  },
  redis: process.env.REDIS,
  resend: process.env.RESEND,
  privatekeySecret: process.env.PRIVATE_KEY_SECRET,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    url: process.env.AWS_URL
  }
});
