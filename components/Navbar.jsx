"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  home: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M3 11.5 L12 4 L21 11.5" />
      <path d="M5.5 9.5 V20 H18.5 V9.5" />
    </svg>
  ),
  submit: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M12 5 V19" />
      <path d="M5 12 H19" />
    </svg>
  ),
  feedback: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M4 6 H20" />
      <path d="M4 12 H20" />
      <path d="M4 18 H13" />
    </svg>
  ),
  about: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11 V16" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const links = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/submit", label: "Submit", icon: "submit" },
  { href: "/feedback", label: "Feedback", icon: "feedback" },
  { href: "/about", label: "About", icon: "about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-navy text-[#e8ecf5]">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-14">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-brand">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,13 7,13 10,7 14,19 17,13 22,13" />
            </svg>
          </span>
          <span className="text-[16.5px] font-semibold tracking-tight">CloudPulse</span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.06em] md:flex">
          {links.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 pb-1 ${
                  active
                    ? "border-b-2 border-brand text-white"
                    : "text-navlink transition-colors hover:text-white"
                }`}
              >
                {icons[icon]}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* TODO: integrate user auth/Cognito state here */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/signin"
            className={`rounded-[3px] border px-3 py-1.5 font-mono text-[11px] transition-colors ${
              pathname === "/signin"
                ? "border-brand bg-brand text-white"
                : "border-chip text-navlink hover:text-white"
            }`}
          >
            SIGN IN
          </Link>
          <Link
            href="/signup"
            className={`hidden rounded-[3px] border px-3 py-1.5 font-mono text-[11px] transition-colors sm:inline-block ${
              pathname === "/signup"
                ? "border-brand bg-brand text-white"
                : "border-chip text-navlink hover:text-white"
            }`}
          >
            SIGN UP
          </Link>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex gap-6 overflow-x-auto px-5 pb-3 font-mono text-xs uppercase tracking-[0.06em] md:hidden">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 pb-1 whitespace-nowrap ${
                active ? "border-b-2 border-brand text-white" : "text-navlink"
              }`}
            >
              {icons[icon]}
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
