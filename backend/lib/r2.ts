import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

let s3Client: S3Client | null = null;

if (accessKeyId && secretAccessKey && endpoint) {
  s3Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
} else {
  console.warn("WARNING: Cloudflare R2 credentials are not set. R2 file uploads will be disabled.");
}

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!s3Client || !bucketName || !publicUrl) {
    console.warn("Cloudflare R2 is not fully configured. Falling back to default mock avatar.");
    return `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80`;
  }

  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    const url = `${publicUrl.replace(/\/$/, "")}/${uniqueFileName}`;
    console.log(`File successfully uploaded to Cloudflare R2: ${url}`);
    return url;
  } catch (error) {
    console.error("Cloudflare R2 Upload Error:", error);
    throw error;
  }
}
