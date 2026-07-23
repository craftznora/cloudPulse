import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME || "CloudPulseFeedback";

const CATEGORIES = ["FEATURE", "BUG", "PROCESS", "PRAISE"];

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Request body must be valid JSON." });
  }

  const title = (payload.title || "").trim();
  const description = (payload.description || "").trim();
  const category = (payload.category || "").trim().toUpperCase();

  if (title.length < 5 || title.length > 120) {
    return response(400, { error: "Title is required, 5 to 120 characters." });
  }
  if (!description || description.length > 1000) {
    return response(400, { error: "Description is required, up to 1000 characters." });
  }
  if (!CATEGORIES.includes(category)) {
    return response(400, { error: `Category must be one of: ${CATEGORIES.join(", ")}.` });
  }

  // Phase 4: the JWT authorizer already verified the token; its claims are
  // trusted, so author comes from Cognito, never from the request body
  const claims = event.requestContext?.authorizer?.jwt?.claims || {};
  const author = claims.name || claims.email || "Anonymous";

  const item = {
    feedbackId: randomUUID(),
    title,
    description,
    category,
    author,
    createdAt: new Date().toISOString(),
    // sentiment is added by Comprehend in Phase 5
    // attachmentKey is added by the S3 upload flow in Phase 3
  };

  if (payload.attachmentKey) item.attachmentKey = String(payload.attachmentKey);

  await client.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

  console.log("Created feedback", item.feedbackId);
  return response(201, { item });
};
