"use client";

import { useState } from "react";
import Link from "next/link";
import CognitoNote from "../../components/CognitoNote";

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return score;
}

const strengthLabels = ["", "WEAK", "FAIR", "GOOD", "STRONG"];
const strengthColors = ["", "bg-neg", "bg-bug", "bg-pos", "bg-pos"];

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const score = passwordStrength(password);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: connect with Cognito signup and verification flows
    setSubmitted(true);
  }

  return (
    <div className="dot-grid flex justify-center px-5 pb-20 pt-12 sm:px-14 sm:pt-16">
      <div className="flex w-full max-w-[440px] flex-col gap-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-lg border border-line bg-white px-6 py-7 sm:px-9.5 sm:py-9"
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] tracking-[0.1em] text-brand">
                CREATE ACCOUNT
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-faint">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-brand font-semibold text-white">
                  1
                </span>
                DETAILS
                <span className="inline-block h-px w-3.5 bg-input-line" />
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-neu-soft font-semibold text-faint">
                  2
                </span>
                VERIFY
              </div>
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">
              Join your team
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              One account to submit and track feedback across the team.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[13.5px] font-semibold">
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amina Rahman"
              className="rounded-[5px] border border-input-line bg-input-bg px-4 py-3 text-[14.5px] outline-none focus:border-brand focus:shadow-[0_0_0_3px_#e9edf9]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[13.5px] font-semibold">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.dev"
              className="rounded-[5px] border border-input-line bg-input-bg px-4 py-3 text-[14.5px] outline-none focus:border-brand focus:shadow-[0_0_0_3px_#e9edf9]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[13.5px] font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="rounded-[5px] border border-input-line bg-input-bg px-4 py-3 text-[14.5px] outline-none focus:border-brand focus:shadow-[0_0_0_3px_#e9edf9]"
            />
            <div className="flex items-center gap-2.5">
              <div className="flex flex-none gap-[3px]">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`h-1 w-6.5 rounded-[2px] ${
                      password && step <= score ? strengthColors[score] : "bg-line-soft"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10.5px] text-faint">
                {password ? `${strengthLabels[score] || "WEAK"} · ` : ""}8+ CHARS · 1 NUMBER · 1 SYMBOL
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-[5px] bg-brand py-3.5 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
          >
            Continue → verify email
          </button>

          {submitted && (
            <div className="pop-in rounded-[5px] bg-pos-soft px-4 py-3 font-mono text-xs text-pos">
              Mock account created. Cognito authentication integration is pending.
            </div>
          )}

          <div className="flex items-start gap-3 rounded-[5px] border border-line-soft bg-panel px-4 py-3.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3d5ac8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none">
              <rect x="3" y="5.5" width="18" height="13" rx="2" />
              <path d="M3.5 7 L12 13 L20.5 7" />
            </svg>
            <span className="text-[12.5px] leading-relaxed text-muted">
              Next step: we email you a 6-digit code to confirm your address. Enter it
              once and you're in.
            </span>
          </div>

          <div className="text-center text-[13.5px] text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-brand">
              Sign in
            </Link>
          </div>
        </form>

        <CognitoNote text="PASSWORDS HANDLED BY AMAZON COGNITO — NEVER STORED BY THE APP" />
      </div>
    </div>
  );
}
