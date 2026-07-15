import Link from "next/link";
import Badge from "../components/Badge";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import SentimentBar from "../components/SentimentBar";
import { feedbackItems, stats, sentimentSplit, totalSubmissions } from "../lib/data";

const activity = [
  {
    time: "14:02",
    text: (
      <>
        <strong className="font-semibold">Priya S.</strong> submitted{" "}
        <strong className="font-semibold">“Dark mode for the dashboard”</strong>{" "}
        <Badge label="POS" />
      </>
    ),
  },
  {
    time: "11:41",
    text: (
      <>
        <strong className="font-semibold">Jonas K.</strong> attached{" "}
        <span className="text-brand">screenshot.png</span> to{" "}
        <strong className="font-semibold">“Uploads fail over 5 MB”</strong>
      </>
    ),
  },
  {
    time: "09:15",
    text: (
      <>
        <strong className="font-semibold">Maya T.</strong> sent praise for{" "}
        <strong className="font-semibold">“New standup format works”</strong>{" "}
        <Badge label="POS" />
      </>
    ),
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-5 pb-14 pt-14 sm:px-14 sm:pt-18">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <Reveal>
            <div className="mb-4 font-mono text-xs tracking-[0.1em] text-brand">
              TEAM FEEDBACK · SERVERLESS · FREE TIER
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-[58px]">
              Ship feedback like you ship code.
            </h1>
            <p className="mt-5 mb-8 max-w-[480px] text-[16.5px] leading-relaxed text-muted">
              Every idea, bug, and note lands in one searchable list. Tagged,
              sentiment-scored, and ready for the team to review.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/submit"
                className="rounded-[5px] bg-brand px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
              >
                Submit feedback
              </Link>
              <Link
                href="/feedback"
                className="rounded-[5px] border border-input-line bg-white px-5 py-3 font-mono text-[13px] transition-all hover:border-brand active:scale-[0.98]"
              >
                BROWSE LIST
              </Link>
            </div>
          </Reveal>

          {/* Live activity card */}
          <Reveal delay={150}>
            <div className="hover-lift rounded-lg border border-line bg-white px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.1em] text-faint">
                  LIVE ACTIVITY
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-pos">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-pos" />
                  UPDATED NOW
                </span>
              </div>
              <div>
                {activity.map((a, i) => (
                  <div
                    key={a.time}
                    className={`flex gap-3.5 py-3 ${i < activity.length - 1 ? "border-b border-line-soft" : ""}`}
                  >
                    <span className="w-[52px] flex-none pt-0.5 font-mono text-[11px] text-faint">
                      {a.time}
                    </span>
                    <div className="text-[13.5px] leading-normal">{a.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-1 border-t border-line-soft pt-3.5 font-mono text-[11px] text-faint">
                {totalSubmissions} SUBMISSIONS THIS MONTH
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-5 sm:px-14">
        <Reveal delay={100}>
          <div className="grid grid-cols-2 rounded-lg border border-line bg-white md:grid-cols-[repeat(4,1fr)_1.4fr]">
            {stats.map(({ label, count }) => (
              <div key={label} className="border-b border-r border-line-soft px-6 py-5 md:border-b-0">
                <CountUp
                  value={count}
                  className="font-mono text-[34px] font-semibold leading-none"
                />
                <div className="mt-2 font-mono text-[10.5px] tracking-[0.1em] text-faint">
                  {label}
                </div>
              </div>
            ))}
            <div className="col-span-2 flex flex-col justify-center gap-2.5 px-6 py-5 md:col-span-1">
              <div className="font-mono text-[10.5px] tracking-[0.1em] text-faint">
                SENTIMENT · 30 DAYS
              </div>
              <SentimentBar
                pos={sentimentSplit.pos}
                neu={sentimentSplit.neu}
                neg={sentimentSplit.neg}
              />
              <div className="flex gap-3.5 font-mono text-[11px] text-muted">
                <span>POS {sentimentSplit.pos}%</span>
                <span>NEU {sentimentSplit.neu}%</span>
                <span>NEG {sentimentSplit.neg}%</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Recent feedback */}
      <section className="px-5 pb-16 pt-10 sm:px-14">
        <Reveal>
          <div className="mb-3.5 flex items-baseline justify-between">
            <span className="font-mono text-xs tracking-[0.1em] text-faint">
              RECENT FEEDBACK · NEWEST FIRST
            </span>
            <Link href="/feedback" className="text-[13.5px] font-semibold text-brand">
              View all →
            </Link>
          </div>
        </Reveal>
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {feedbackItems.slice(0, 3).map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <div
                className={`grid items-center gap-3 px-6 py-4.5 transition-colors hover:bg-panel sm:grid-cols-[1fr_auto_auto_auto] sm:gap-5 ${
                  i < 2 ? "border-b border-line-soft" : ""
                }`}
              >
                <div>
                  <div className="text-[15.5px] font-semibold">
                    {item.title}{" "}
                    {item.attachment && (
                      <span className="font-mono text-[11px] font-normal text-faint">
                        ⎘ 1 attachment
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">{item.description}</div>
                </div>
                <Badge label={item.category} />
                <Badge label={item.sentiment} />
                <span className="font-mono text-[11.5px] text-faint sm:w-[88px] sm:text-right">
                  {item.createdAgo}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
