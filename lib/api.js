// API client for CloudPulse.
// Uses the real API Gateway endpoint when NEXT_PUBLIC_API_URL is set
// (in .env.local for dev, Amplify environment variables for prod).

import { feedbackItems as mockItems } from "./data";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiEnabled = Boolean(API_URL);

const SENTIMENT_KEYS = { POSITIVE: "POS", NEUTRAL: "NEU", NEGATIVE: "NEG" };

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function createdLabel(iso) {
  const d = new Date(iso);
  const time = d.toISOString().slice(11, 16);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return `TODAY ${time}`;
  if (days === 1) return `YESTERDAY ${time}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()} · ${days}D AGO`;
}

// Maps a DynamoDB item (from the API) to the shape the UI renders.
// UI-only fields are derived here instead of being stored in the table.
function normalize(item) {
  const sentiment = SENTIMENT_KEYS[item.sentiment] ?? item.sentiment ?? null;
  return {
    id: item.feedbackId,
    feedbackId: item.feedbackId,
    ref: `#${item.feedbackId.slice(0, 8)}`,
    title: item.title,
    description: item.description,
    body: item.description ? item.description.split(/\n\s*\n/) : [],
    author: item.author || "Anonymous",
    category: item.category,
    sentiment,
    sentimentScores: item.sentimentScores || null,
    attachment: item.attachmentKey
      ? {
          name: item.attachmentKey.split("/").pop(),
          key: item.attachmentKey,
          type: (item.attachmentKey.split(".").pop() || "file").toUpperCase(),
          size: "",
        }
      : null,
    createdAt: item.createdAt,
    createdAgo: timeAgo(item.createdAt),
    createdLabel: createdLabel(item.createdAt),
  };
}

export async function fetchFeedback() {
  if (!apiEnabled) {
    // Mock mode: short delay so the skeleton state stays visible
    await new Promise((r) => setTimeout(r, 700));
    return mockItems;
  }
  const res = await fetch(`${API_URL}/feedback`);
  if (!res.ok) throw new Error(`GET /feedback failed (${res.status})`);
  const data = await res.json();
  return (data.items || []).map(normalize);
}

export async function createFeedback({ title, description, category, attachmentKey }) {
  if (!apiEnabled) {
    await new Promise((r) => setTimeout(r, 500));
    return normalize({
      feedbackId: crypto.randomUUID(),
      title,
      description,
      category: category.toUpperCase(),
      createdAt: new Date().toISOString(),
      attachmentKey,
    });
  }
  const body = { title, description, category };
  if (attachmentKey) body.attachmentKey = attachmentKey;
  const res = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `POST /feedback failed (${res.status})`);
  return normalize(data.item);
}

// ---------- Attachments (pre-signed S3 URLs) ----------

export async function getUploadUrl(fileName, contentType) {
  const res = await fetch(`${API_URL}/attachments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, contentType }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Could not get upload URL (${res.status})`);
  return data; // { uploadUrl, key }
}

export async function getDownloadUrl(key) {
  const res = await fetch(`${API_URL}/attachments?key=${encodeURIComponent(key)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Could not get download URL (${res.status})`);
  return data.downloadUrl;
}
