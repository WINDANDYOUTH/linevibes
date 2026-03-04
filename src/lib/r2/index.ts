/**
 * Cloudflare R2 Storage Utility
 *
 * Handles uploading images to the R2 bucket (S3-compatible).
 * Uses the existing @aws-sdk/client-s3 dependency.
 */
import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3"

let client: S3Client | null = null

function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }
  return client
}

const BUCKET = process.env.R2_BUCKET_NAME || "linevibes"
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://uploads.linevibes.com"

/**
 * Upload a buffer to R2 and return the public URL.
 *
 * @param key   - Object key, e.g., `portraits/{sessionId}/original.jpg`
 * @param body  - File buffer
 * @param contentType - MIME type
 * @returns Public URL of the uploaded object
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }

  await getR2Client().send(new PutObjectCommand(params))

  return `${PUBLIC_URL}/${key}`
}

/**
 * Build the R2 key path for portrait session assets.
 */
export function portraitKey(
  sessionId: string,
  filename: string
): string {
  return `portraits/${sessionId}/${filename}`
}
