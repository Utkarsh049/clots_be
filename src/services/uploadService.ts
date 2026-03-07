import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../config/s3.js";
import path from "path";

const bucketName = process.env.AWS_S3_BUCKET || "clots-images";
const region = process.env.AWS_REGION || "ap-south-1";

export const uploadImageToS3 = async (
  fileBuffer: Buffer,
  originalName: string,
  mimetype: string,
): Promise<string> => {
  const extension = path.extname(originalName);
  const uniqueFilename = `${uuidv4()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: fileBuffer,
    ContentType: mimetype,
    // Note: ACL: 'public-read' requires the bucket to allow public ACLs.
    // Assuming bucket policies / ACLs are configured correctly in AWS.
  });

  await s3Client.send(command);

  // Construct the public URL
  // Format: https://<bucket-name>.s3.<region>.amazonaws.com/<key>
  const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFilename}`;

  return publicUrl;
};
