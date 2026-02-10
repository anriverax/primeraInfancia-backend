import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fs from "fs";

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private readonly config: ConfigService) {
    this.bucketName = this.config.get<string>("aws.bucketName")!;

    this.s3 = new S3Client({
      region: this.config.get<string>("aws.region")!,
      credentials: {
        accessKeyId: this.config.get<string>("aws.accessKeyId")!,
        secretAccessKey: this.config.get<string>("aws.secretAccessKey")!
      }
    });
  }

  async uploadFile(file: Express.Multer.File, isBase64: boolean, folder: string): Promise<string> {
    const awsUrl = this.config.get<string>("aws.url")!;

    let Body: Buffer | fs.ReadStream;
    let ContentEncoding: string | undefined;

    if (isBase64) {
      Body = Buffer.from(file.buffer.toString(), "base64");

      ContentEncoding = "base64";
    } else if (file.buffer)
      Body = file.buffer; // Multer memoryStorage
    else Body = fs.createReadStream(file.path); // Multer diskStorage

    const params = {
      Key: `${folder}/${file.filename || file.originalname}`,
      Body,
      ...(ContentEncoding && { ContentEncoding })
    };

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      ContentType: file.mimetype,
      ...params
    });

    const result = await this.s3.send(command);

    if (result.$metadata.httpStatusCode !== 200) {
      throw new Error("Error uploading file to S3");
    }

    return `${awsUrl}${params.Key}`;
  }
}
