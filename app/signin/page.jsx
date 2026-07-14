"use client";

import { useState } from "react";
import Link from "next/link";
import CognitoNote from "../../components/CognitoNote";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: integrate with Cognito authentication
    setSubmitted(true);
  }

  return (
    <div className="dot-grid flex justify-center px-5 pb-24 pt-14 sm:px-14 sm:pt-21">
      <div className="flex w-full max-w-[440px] flex-col gap-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5.5 rounded-lg border border-line bg-white px-6 py-7 sm:px-9.5 sm:py-9"
        >
          <div className="flex flex-col gap-2.5">
            <div className="font-mono text-[11px] tracking-[0.1em] text-brand">
              SECURE SIGN IN
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">
              Welcome back
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              Sign in to submit feedback. Browsing the list stays open to everyone.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[13.5px] font-semibold">
              Email
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
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-[13.5px] font-semibold">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[12.5px] font-medium text-brand"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3 rounded-[5px] border border-input-line bg-input-bg px-4 py-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_#e9edf9]">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-transparent text-[14.5px] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="flex-none text-faint transition-colors hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12 C4.5 7 8 4.8 12 4.8 C16 4.8 19.5 7 22 12 C19.5 17 16 19.2 12 19.2 C8 19.2 4.5 17 2 12 Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPw && <path d="M4 20 L20 4" />}
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-[5px] bg-brand py-3.5 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
          >
            Sign in
          </button>

          {submitted && (
            <div className="pop-in rounded-[5px] bg-pos-soft px-4 py-3 font-mono text-xs text-pos">
              Mock sign-in successful. Integration with Cognito auth is pending.
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-line-soft" />
            <span className="font-mono text-[10.5px] text-faint">OR</span>
            <span className="h-px flex-1 bg-line-soft" />
          </div>

          <div className="text-center text-[13.5px] text-muted">
            New to CloudPulse?{" "}
            <Link href="/signup" className="font-semibold text-brand">
              Create an account
            </Link>
          </div>
        </form>

        <CognitoNote text="AUTH BY AMAZON COGNITO · SESSION TOKEN AUTO-REFRESHES" />
      </div>
    </div>
  );
}
