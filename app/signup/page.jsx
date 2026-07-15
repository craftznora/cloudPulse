"use client";

import { useEffect, useRef, useState } from "react";
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

const RESEND_SECONDS = 45;

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [verified, setVerified] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const inputsRef = useRef([]);

  const score = passwordStrength(password);

  useEffect(() => {
    if (step !== 2 || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  function handleDetails(e) {
    e.preventDefault();
    // TODO: connect with Cognito signup and verification flows
    setStep(2);
    setResendIn(RESEND_SECONDS);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }

  function handleCodeChange(i, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[i] = value;
    setCode(next);
    setCodeError(false);
    if (value && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function handleCodeKeyDown(i, e) {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  function handleCodePaste(e) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = digits[i] ?? "";
    setCode(next);
    setCodeError(false);
    inputsRef.current[Math.min(digits.length, 5)]?.focus();
  }

  function handleVerify(e) {
    e.preventDefault();
    if (code.some((d) => d === "")) {
      setCodeError(true);
      return;
    }
    setVerified(true);
  }

  function handleResend() {
    setCode(["", "", "", "", "", ""]);
    setResendIn(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  }

  const stepper = (
    <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-faint">
      {step === 1 ? (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-brand font-semibold text-white">
          1
        </span>
      ) : (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-pos-soft font-semibold text-pos">
          ✓
        </span>
      )}
      DETAILS
      <span className="inline-block h-px w-3.5 bg-input-line" />
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-[4px] font-semibold ${
          step === 2 ? "bg-brand text-white" : "bg-neu-soft text-faint"
        }`}
      >
        2
      </span>
      VERIFY
    </div>
  );

  return (
    <div className="flex justify-center px-5 pb-20 pt-12 sm:px-14 sm:pt-16">
      <div className="flex w-full max-w-[440px] flex-col gap-4">
        {step === 1 ? (
          <form
            onSubmit={handleDetails}
            className="flex flex-col gap-5 rounded-lg border border-line bg-white px-6 py-7 sm:px-9.5 sm:py-9"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.1em] text-brand">
                  CREATE ACCOUNT
                </div>
                {stepper}
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
                placeholder="John Wick"
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
                  {[1, 2, 3, 4].map((s) => (
                    <span
                      key={s}
                      className={`h-1 w-6.5 rounded-[2px] ${
                        password && s <= score ? strengthColors[score] : "bg-line-soft"
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
              Continue to verification
            </button>

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
        ) : (
          <form
            onSubmit={handleVerify}
            className="pop-in flex flex-col gap-5.5 rounded-lg border border-line bg-white px-6 py-7 sm:px-9.5 sm:py-9"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.1em] text-brand">
                  CREATE ACCOUNT
                </div>
                {stepper}
              </div>
              <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">
                Check your inbox
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                We sent a 6-digit code to{" "}
                <strong className="font-semibold text-ink">{email}</strong>. It expires
                in 10 minutes.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[13.5px] font-semibold">Verification code</span>
              <div className="grid grid-cols-6 gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    onPaste={i === 0 ? handleCodePaste : undefined}
                    aria-label={`Digit ${i + 1}`}
                    className={`rounded-[5px] border py-3.5 text-center font-mono text-xl font-semibold outline-none ${
                      codeError && digit === ""
                        ? "border-neg bg-[#fffafa]"
                        : "border-input-line bg-input-bg focus:border-brand focus:shadow-[0_0_0_3px_#e9edf9]"
                    }`}
                  />
                ))}
              </div>
              {codeError && (
                <span className="text-[12.5px] font-medium text-neg">
                  Enter all 6 digits from the email.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="rounded-[5px] bg-brand py-3.5 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
            >
              Verify &amp; create account
            </button>

            {verified && (
              <div className="pop-in rounded-[5px] bg-pos-soft px-4 py-3 font-mono text-xs text-pos">
                Mock account verified. Cognito authentication integration is pending.
              </div>
            )}

            <div className="flex items-center justify-between text-[13px] text-muted">
              <span>
                Didn't get it?{" "}
                {resendIn > 0 ? (
                  <span className="font-semibold text-faint">Resend code</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-brand"
                  >
                    Resend code
                  </button>
                )}
              </span>
              <span className="font-mono text-[10.5px] text-faint">
                {resendIn > 0
                  ? `RESEND IN 0:${String(resendIn).padStart(2, "0")}`
                  : "READY TO RESEND"}
              </span>
            </div>
          </form>
        )}

        <CognitoNote text="SECURED BY AMAZON COGNITO" />
      </div>
    </div>
  );
}
