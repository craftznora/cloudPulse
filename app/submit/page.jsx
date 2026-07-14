"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "../../lib/data";
import Reveal from "../../components/Reveal";

const steps = [
  {
    title: "Submit feedback",
    body: "Provide a clear title, select the category, and fill in the details.",
  },
  {
    title: "Automatic analysis",
    body: "The system automatically analyzes and scores sentiment.",
  },
  {
    title: "Team review",
    body: "Our product and engineering leads review submissions for sprint planning.",
  },
];

const MAX_DESC = 1000;
const MAX_FILE_MB = 10;
const ALLOWED_EXT = /\.(png|jpe?g|pdf)$/i;

const categoryTones = {
  FEATURE: "text-brand",
  BUG: "text-bug",
  PROCESS: "text-process",
  PRAISE: "text-praise",
};

// Stand-in scoring until the real Comprehend call is wired up
function mockSentiment(text) {
  const t = text.toLowerCase();
  if (/(fail|bug|broken|crash|error|404|outdated|slow|wrong)/.test(t)) {
    return { label: "NEGATIVE", tone: "text-neg", score: 0.84 };
  }
  if (/(great|love|works|thanks|awesome|faster|good|easier|helps)/.test(t)) {
    return { label: "POSITIVE", tone: "text-pos", score: 0.91 };
  }
  return { label: "NEUTRAL", tone: "text-faint", score: 0.72 };
}

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Feature");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSizeMB, setFileSizeMB] = useState(0);
  const [titleError, setTitleError] = useState("");
  const [upload, setUpload] = useState(null); // { name, sizeMB, progress }
  const [rejected, setRejected] = useState(null); // { name, sizeMB, badType }
  const [result, setResult] = useState(null);
  const uploadTimer = useRef(null);

  useEffect(() => () => clearInterval(uploadTimer.current), []);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_MB || !ALLOWED_EXT.test(file.name)) {
      setRejected({ name: file.name, sizeMB, badType: !ALLOWED_EXT.test(file.name) });
      setFileName("");
      return;
    }

    setRejected(null);
    setFileName("");
    setUpload({ name: file.name, sizeMB, progress: 0 });

    // Simulates the PUT to a pre-signed S3 URL until the API is wired up
    clearInterval(uploadTimer.current);
    uploadTimer.current = setInterval(() => {
      setUpload((u) => {
        if (!u) return null;
        const progress = Math.min(u.progress + 6 + Math.random() * 7, 100);
        if (progress >= 100) {
          clearInterval(uploadTimer.current);
          setFileName(u.name);
          setFileSizeMB(u.sizeMB);
          return null;
        }
        return { ...u, progress };
      });
    }, 160);
  }

  function cancelUpload() {
    clearInterval(uploadTimer.current);
    setUpload(null);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setFileName("");
    setFileSizeMB(0);
    setTitleError("");
    setRejected(null);
    setResult(null);
    cancelUpload();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 5 || trimmed.length > 120) {
      setTitleError("Title is required, 5 to 120 characters.");
      return;
    }
    // TODO: Send POST request to /feedback API endpoint
    setResult({
      id: "FB-1044",
      title: trimmed,
      category: category.toUpperCase(),
      sentiment: mockSentiment(`${trimmed} ${description}`),
      attachment: fileName || "none",
    });
  }

  const descPct = Math.round((description.length / MAX_DESC) * 100);
  const descTone =
    description.length >= MAX_DESC
      ? { text: "text-neg", bar: "bg-neg" }
      : description.length >= MAX_DESC * 0.9
        ? { text: "text-bug", bar: "bg-bug" }
        : { text: "text-faint", bar: "bg-brand" };

  if (result) {
    return (
      <div className="flex justify-center px-5 pb-24 pt-14 sm:px-14 sm:pt-21">
        <div className="pop-in flex w-full max-w-[560px] flex-col items-center gap-5.5 self-start rounded-lg border border-line bg-white px-6 py-9 text-center sm:px-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pos-soft">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2e7d5b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">
              Feedback submitted
            </h1>
            <p className="max-w-[400px] text-[14.5px] leading-relaxed text-muted">
              "{result.title}" went through the demo flow. The real API saves it in Phase 2.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-[6px] border border-line-soft bg-panel px-4.5 py-4 text-left font-mono text-[11px] text-muted">
            <div className="flex justify-between">
              <span className="text-faint">id</span>
              <span>{result.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-faint">category</span>
              <span className={categoryTones[result.category] ?? "text-ink"}>
                {result.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-faint">sentiment</span>
              <span className={result.sentiment.tone}>
                {result.sentiment.label} · {result.sentiment.score.toFixed(2)} · simulated
                (Comprehend in Phase 5)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-faint">attachment</span>
              <span>{result.attachment}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link
              href="/feedback"
              className="rounded-[5px] bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20"
            >
              View in list →
            </Link>
            <button
              onClick={resetForm}
              className="rounded-[5px] border border-input-line px-5.5 py-3 text-sm font-medium transition-colors hover:border-brand"
            >
              Submit another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page head */}
      <section className="px-5 pb-6 pt-12 sm:px-14">
        <Reveal>
          <div className="mb-3 font-mono text-xs tracking-[0.1em] text-brand">
            POST /feedback · AUTH REQUIRED
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[40px]">Submit feedback</h1>
          <p className="mt-3 max-w-[520px] text-[15.5px] text-muted">
            Keep it short and specific. Sentiment is scored automatically when you submit.
          </p>
        </Reveal>
      </section>

      <section className="grid items-start gap-6 px-5 pb-16 pt-6 sm:px-14 lg:grid-cols-[1.7fr_1fr]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6 rounded-lg border border-line bg-white px-6 py-8 sm:px-9"
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="title" className="text-[13.5px] font-semibold">
                Title
              </label>
              <span className={`font-mono text-[10.5px] ${titleError ? "text-neg" : "text-faint"}`}>
                REQUIRED
              </span>
            </div>
            <input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="One line, e.g. Dark mode for the dashboard"
              className={`rounded-[5px] border px-4 py-3 text-[14.5px] outline-none ${
                titleError
                  ? "border-neg bg-[#fffafa] shadow-[0_0_0_3px_#f8e9e5]"
                  : "border-input-line bg-input-bg focus:border-brand"
              }`}
            />
            {titleError && (
              <div className="pop-in flex items-center gap-1.5 text-[12.5px] font-medium text-neg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8 V13" />
                  <circle cx="12" cy="16.2" r="1" fill="currentColor" stroke="none" />
                </svg>
                {titleError}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[13.5px] font-semibold">Category</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-[5px] border px-4 py-2 text-[13.5px] transition-colors ${
                    category === c
                      ? "border-brand bg-brand-soft font-semibold text-brand"
                      : "border-input-line font-medium text-muted hover:border-brand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="description" className="text-[13.5px] font-semibold">
                Description
              </label>
              <span className={`font-mono text-[10.5px] ${descTone.text}`}>
                {description.length} / {MAX_DESC}
              </span>
            </div>
            <textarea
              id="description"
              required
              maxLength={MAX_DESC}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the idea, what problem does it solve, and who benefits?"
              className="min-h-[120px] resize-y rounded-[5px] border border-input-line bg-input-bg px-4 py-3.5 text-[14.5px] leading-relaxed outline-none focus:border-brand"
            />
            {description.length > 0 && (
              <div className="h-1 rounded-[2px] bg-neu-soft">
                <div
                  className={`h-1 rounded-[2px] transition-all ${descTone.bar}`}
                  style={{ width: `${descPct}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[13.5px] font-semibold">Attachment</span>
              <span className={`font-mono text-[10.5px] ${upload ? "text-brand" : "text-faint"}`}>
                {upload ? "UPLOADING" : "OPTIONAL"}
              </span>
            </div>

            {upload ? (
              <div className="flex items-center gap-3.5 rounded-[5px] border border-line bg-input-bg px-4 py-3.5">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[5px] bg-neu-soft">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3d5ac8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
                    <circle cx="9" cy="10" r="1.6" />
                    <path d="M3.5 16.5 L9.5 11.5 L14 15.5 L16.5 13.5 L20.5 16.5" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-[13.5px] font-semibold">{upload.name}</span>
                    <span className="font-mono text-[10.5px] text-brand">
                      {Math.round(upload.progress)}%
                    </span>
                  </div>
                  <div className="h-[5px] rounded-[3px] bg-neu-soft">
                    <div
                      className="h-[5px] rounded-[3px] bg-brand transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-faint">
                    PUT VIA PRE-SIGNED S3 URL ·{" "}
                    {((upload.progress / 100) * upload.sizeMB).toFixed(1)} OF{" "}
                    {upload.sizeMB.toFixed(1)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="rounded-[4px] border border-line px-3 py-1.5 font-mono text-[10.5px] text-muted transition-colors hover:border-neg hover:text-neg"
                >
                  CANCEL
                </button>
              </div>
            ) : rejected ? (
              <div className="pop-in flex items-center gap-3 rounded-[5px] border border-neg bg-[#fffafa] px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c05a45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M9 9 L15 15" />
                  <path d="M15 9 L9 15" />
                </svg>
                <span className="flex-1 text-[13px] text-neg">
                  <strong className="font-semibold">{rejected.name}</strong>{" "}
                  {rejected.badType
                    ? `isn't a supported type. PNG, JPG, PDF only (max ${MAX_FILE_MB} MB).`
                    : `is ${Math.round(rejected.sizeMB)} MB, max is ${MAX_FILE_MB} MB (PNG, JPG, PDF only).`}
                </span>
                <button
                  type="button"
                  onClick={() => setRejected(null)}
                  className="font-mono text-[10.5px] text-muted hover:text-ink"
                >
                  DISMISS
                </button>
              </div>
            ) : (
              <label className="cursor-pointer rounded-[5px] border-[1.5px] border-dashed border-input-line bg-input-bg p-6 text-center transition-colors hover:border-brand">
                <input type="file" className="hidden" onChange={handleFile} />
                <div className="text-sm font-semibold">
                  {fileName || (
                    <>
                      Drop a file or <span className="text-brand">browse</span>
                    </>
                  )}
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-faint">
                  {fileName
                    ? `READY · ${fileSizeMB.toFixed(1)} MB · UPLOADS ON SUBMIT`
                    : `PNG · JPG · PDF up to ${MAX_FILE_MB} MB · uploads via pre-signed S3 URL`}
                </div>
              </label>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-[11px] text-faint">
              SECURE PORTAL · ENCRYPTED SUBMISSION
            </span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-[5px] border border-input-line px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-faint"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[5px] bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
              >
                Submit feedback
              </button>
            </div>
          </div>
        </form>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          <Reveal delay={150}>
          <div className="hover-lift rounded-lg border border-line bg-white px-6 py-6">
            <div className="mb-4 font-mono text-[11px] tracking-[0.1em] text-faint">
              WHAT HAPPENS NEXT
            </div>
            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div key={s.title} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-[5px] bg-brand-soft font-mono text-[11px] font-semibold text-brand">
                      {i + 1}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-line-soft" />
                    )}
                  </div>
                  <div className={i < steps.length - 1 ? "pb-4" : ""}>
                    <div className="text-[13.5px] font-semibold">{s.title}</div>
                    <div className="mt-0.5 text-[12.5px] leading-normal text-muted">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          </Reveal>
          <Reveal delay={250}>
          <div className="rounded-lg bg-navy px-6 py-5 text-subtext">
            <div className="mb-2.5 font-mono text-[11px] tracking-[0.1em] text-navlink">
              WRITING TIP
            </div>
            <div className="text-[13.5px] leading-relaxed">
              Focus on one topic per post. Specific titles like "Dark mode for the dashboard" help us track, tag, and fix issues much faster.
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
