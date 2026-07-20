import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const s3 = new S3Client({});
const BUCKET = process.env.BUCKET_NAME;
const EXPIRES_SECONDS = 300;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;

  if (method === "POST") {
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return response(400, { error: "Request body must be valid JSON." });
    }

    const contentType = (payload.contentType || "").trim();
    if (!ALLOWED_TYPES.includes(contentType)) {
      return response(400, { error: "Only PNG, JPG and PDF files are allowed." });
    }

    // Keep just the base name and strip anything unusual from it
    const rawName = String(payload.fileName || "file").split("/").pop();
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100) || "file";
    const key = `uploads/${randomUUID()}/${safeName}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: EXPIRES_SECONDS }
    );

    console.log("Issued upload URL for", key);
    return response(200, { uploadUrl, key });
  }

  if (method === "GET") {
    const key = event.queryStringParameters?.key || "";
    if (!key.startsWith("uploads/")) {
      return response(400, { error: "Invalid attachment key." });
    }

    const downloadUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: EXPIRES_SECONDS }
    );

    console.log("Issued download URL for", key);
    return response(200, { downloadUrl });
  }

  return response(405, { error: "Method not allowed." });
};
