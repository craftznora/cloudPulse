"use client";

import { useState } from "react";
import { CATEGORIES } from "../../lib/data";
import Reveal from "../../components/Reveal";

const steps = [
  {
    title: "Secure POST",
    body: "Your Cognito token authorizes the request through API Gateway.",
  },
  {
    title: "Sentiment scored",
    body: "Lambda calls Comprehend on your description and tags it POS, NEU or NEG.",
  },
  {
    title: "Stored & listed",
    body: "Item lands in DynamoDB, attachment in private S3, visible in the list instantly.",
  },
];

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Feature");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Phase 2 wires this to POST /feedback (API Gateway + Lambda).
    setSubmitted(true);
  }

  return (
    <div>
      {/* Page head */}
      <section className="dot-grid px-5 pb-6 pt-12 sm:px-14">
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
          className="flex flex-col gap-6 rounded-lg border border-line bg-white px-6 py-8 sm:px-9"
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="title" className="text-[13.5px] font-semibold">
                Title
              </label>
              <span className="font-mono text-[10.5px] text-faint">REQUIRED</span>
            </div>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="One line, e.g. Dark mode for the dashboard"
              className="rounded-[5px] border border-input-line bg-input-bg px-4 py-3 text-[14.5px] outline-none focus:border-brand"
            />
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
              <span className="font-mono text-[10.5px] text-faint">
                {description.length} / 1000
              </span>
            </div>
            <textarea
              id="description"
              required
              maxLength={1000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the idea, what problem does it solve, and who benefits?"
              className="min-h-[120px] resize-y rounded-[5px] border border-input-line bg-input-bg px-4 py-3.5 text-[14.5px] leading-relaxed outline-none focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[13.5px] font-semibold">Attachment</span>
              <span className="font-mono text-[10.5px] text-faint">OPTIONAL</span>
            </div>
            <label className="cursor-pointer rounded-[5px] border-[1.5px] border-dashed border-input-line bg-input-bg p-6 text-center transition-colors hover:border-brand">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
              <div className="text-sm font-semibold">
                {fileName || (
                  <>
                    Drop a file or <span className="text-brand">browse</span>
                  </>
                )}
              </div>
              <div className="mt-1.5 font-mono text-[11px] text-faint">
                PNG · JPG · PDF up to 10 MB · uploads via pre-signed S3 URL
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-4 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-[11px] text-faint">
              SIGN-IN VIA COGNITO · COMING IN PHASE 4
            </span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setFileName("");
                  setSubmitted(false);
                }}
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

          {submitted && (
            <div className="pop-in rounded-[5px] bg-pos-soft px-4 py-3 font-mono text-xs text-pos">
              DEMO: form works. It will POST to the real API in Phase 2.
            </div>
          )}
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
              One issue per submission. “Uploads fail over 5 MB” beats “several upload
              problems” because it's easier to track, tag, and fix.
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
