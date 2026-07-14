"use client";

import { useEffect, useState } from "react";
import Badge from "./Badge";

const sentimentNames = { POS: "POSITIVE", NEU: "NEUTRAL", NEG: "NEGATIVE" };
const sentimentTones = {
  POS: "text-pos bg-pos-soft",
  NEU: "text-faint bg-neu-soft",
  NEG: "text-neg bg-neg-soft",
};
const sentimentText = { POS: "text-pos", NEU: "text-faint", NEG: "text-neg" };

function initials(author) {
  return author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .replace(".", "")
    .toUpperCase();
}

export default function FeedbackDrawer({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [attachmentDemo, setAttachmentDemo] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function copyId() {
    navigator.clipboard?.writeText(item.feedbackId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // TODO: fetch and open pre-signed S3 URL for download
  function openAttachment() {
    setAttachmentDemo(true);
    setTimeout(() => setAttachmentDemo(false), 2200);
  }

  const scores = item.sentimentScores;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fade-in absolute inset-0 bg-navy/40" onClick={onClose} />

      <aside className="drawer-in absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-white md:w-[560px] md:border-l md:border-line md:shadow-[-16px_0_40px_rgba(17,28,48,0.18)]">
        {/* Desktop header */}
        <div className="hidden items-center justify-between border-b border-line-soft px-7 py-4 md:flex">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-faint">FEEDBACK</span>
            <span className="rounded-[3px] bg-neu-soft px-2 py-1 font-mono text-[11px] text-ink">
              {item.ref}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyId}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-line px-2.5 py-1.5 font-mono text-[10.5px] text-muted transition-colors hover:border-brand hover:text-brand"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15 H4 A2 2 0 0 1 2 13 V4 A2 2 0 0 1 4 2 H13 A2 2 0 0 1 15 4 V5" />
              </svg>
              {copied ? "COPIED ✓" : "COPY ID"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-line text-sm text-muted transition-colors hover:border-ink hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mobile header: full-screen sheet style */}
        <div className="flex items-center justify-between bg-navy px-4.5 py-3.5 text-[#e8ecf5] md:hidden">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} aria-label="Back" className="text-base">
              ←
            </button>
            <span className="text-[15px] font-semibold">Feedback</span>
            <span className="rounded-[3px] bg-[#1c2942] px-1.5 py-0.5 font-mono text-[10px] text-navlink">
              {item.ref}
            </span>
          </div>
          <button
            onClick={copyId}
            className="rounded-[3px] border border-chip px-2 py-1 font-mono text-[10px] text-navlink"
          >
            {copied ? "COPIED ✓" : "COPY ID"}
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 md:px-7">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Badge label={item.category} />
              <span className={`rounded-[3px] px-2 py-1 font-mono text-[11px] ${sentimentTones[item.sentiment]}`}>
                {sentimentNames[item.sentiment]} · {scores[item.sentiment.toLowerCase()].toFixed(2)}
              </span>
            </div>
            <h2 className="text-[23px] font-semibold leading-tight tracking-tight md:text-[26px]">
              {item.title}
            </h2>
            <div className="flex items-center gap-2.5">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-neu-soft text-[11px] font-semibold text-brand">
                {initials(item.author)}
              </div>
              <span className="text-[13.5px] font-semibold">{item.author}</span>
              <span className="font-mono text-[11px] text-faint">{item.createdLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-[#3a4458]">
            {item.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {item.attachment && (
            <div className="overflow-hidden rounded-[6px] border border-line">
              <div className="flex items-center justify-between border-b border-line-soft bg-panel px-4 py-3">
                <span className="font-mono text-[10.5px] tracking-[0.08em] text-faint">
                  ATTACHMENT · 1
                </span>
                <span className="font-mono text-[10px] text-faint">PRIVATE S3 BUCKET</span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[5px] bg-neu-soft">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d5ac8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
                    <circle cx="9" cy="10" r="1.6" />
                    <path d="M3.5 16.5 L9.5 11.5 L14 15.5 L16.5 13.5 L20.5 16.5" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[13.5px] font-semibold">{item.attachment.name}</span>
                  <span className="font-mono text-[10.5px] text-faint">
                    {item.attachment.type} · {item.attachment.size}
                  </span>
                </div>
                <button
                  onClick={openAttachment}
                  className="inline-flex items-center gap-1.5 rounded-[5px] bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4 V15" />
                    <path d="M7 11 L12 16 L17 11" />
                    <path d="M5 20 H19" />
                  </svg>
                  Open
                </button>
              </div>
              <div className="border-t border-line-soft px-4 py-2.5 font-mono text-[10px] tracking-[0.06em] text-faint">
                {attachmentDemo
                  ? "DEMO: PRE-SIGNED URL INTEGRATION PENDING"
                  : "OPENS VIA PRE-SIGNED URL · LINK EXPIRES IN 15 MIN"}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-[6px] border border-line-soft bg-panel px-4 py-3.5 font-mono text-[10.5px] text-muted md:text-[11px]">
            <div className="flex justify-between gap-3">
              <span className="text-faint">feedbackId</span>
              <span className="truncate">{item.feedbackId}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-faint">createdAt</span>
              <span>{item.createdAt}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-faint">sentiment</span>
              <span className={sentimentText[item.sentiment]}>
                {sentimentNames[item.sentiment]} · NEG {scores.neg.toFixed(2)} / NEU{" "}
                {scores.neu.toFixed(2)} / POS {scores.pos.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-3 border-t border-line-soft bg-input-bg px-5 py-4 md:flex-row md:justify-between md:px-7">
          <span className="font-mono text-[10px] tracking-[0.06em] text-faint">
            READ-ONLY · ENTRIES CAN'T BE EDITED AFTER POSTING
          </span>
          <div className="hidden gap-2.5 md:flex">
            <button
              onClick={onClose}
              className="rounded-[5px] border border-line px-4.5 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:border-faint"
            >
              Close
            </button>
            {item.attachment && (
              <button
                onClick={openAttachment}
                className="rounded-[5px] bg-brand px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Open attachment
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
