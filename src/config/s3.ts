import { S3Client } from "@aws-sdk/client-s3";

const awsRegion = process.env.AWS_REGION || "ap-south-1";

// Create an S3 client instance
// The SDK will automatically use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from process.env if available,
// but we explicitly pass them if they are defined to be clear about the credentials being used.
const s3Config: any = {
  region: awsRegion,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

export const s3Client = new S3Client(s3Config);
