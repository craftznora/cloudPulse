import Reveal from "../../components/Reveal";
import ServiceIcon from "../../components/ServiceIcon";

const pathNodes = [
  { icon: "browser", tag: "CLIENT", name: "Browser", sub: "Next.js UI over HTTPS", accent: false },
  { icon: "hosting", tag: "HOSTING", name: "Amplify Hosting", sub: "Global CDN edge", accent: false },
  { icon: "gateway", tag: "API", name: "API Gateway", sub: "Validates Cognito JWT", accent: true },
  { icon: "lambda", tag: "COMPUTE", name: "Lambda", sub: "create / list feedback", accent: true },
];

const stores = [
  { icon: "dynamodb", name: "DynamoDB", sub: "CloudPulseFeedback · feedbackId (UUID)" },
  { icon: "s3", name: "S3 (private)", sub: "Attachments · pre-signed URLs · encrypted" },
  { icon: "comprehend", name: "Comprehend", sub: "DetectSentiment on each description" },
];

const whyCards = [
  {
    icon: "zap",
    title: "WHY SERVERLESS",
    body: "No servers to patch or scale. Pay per request, and idle costs nothing.",
  },
  {
    icon: "dynamodb",
    title: "WHY DYNAMODB, NOT RDS",
    body: "Key-value reads by feedbackId, no joins, no idle instance to pay for.",
  },
  {
    icon: "shield",
    title: "SECURITY",
    body: "Private S3, least-privilege IAM roles, Cognito-gated writes.",
  },
  {
    icon: "globe",
    title: "REGION",
    body: "One primary Region, chosen for proximity to users and full service coverage.",
  },
];

const costs = [
  { name: "Lambda", cost: "$0.00 · free tier", free: true },
  { name: "API Gateway", cost: "≈ $0.03", free: false },
  { name: "DynamoDB", cost: "$0.00 · 25 GB free", free: true },
  { name: "S3", cost: "≈ $0.12", free: false },
  { name: "Comprehend", cost: "≈ $1.35", free: false },
  { name: "Amplify + Cognito", cost: "≈ $0.10 · mostly free", free: true },
];

function PathNode({ icon, tag, name, sub, accent }) {
  return (
    <div
      className={`hover-lift rounded-md border px-4 py-4 ${
        accent ? "border-brand bg-brand-soft" : "border-line bg-panel"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`font-mono text-[10px] tracking-[0.08em] ${accent ? "text-brand" : "text-faint"}`}
        >
          {tag}
        </div>
        <ServiceIcon name={icon} size={17} className={accent ? "text-brand" : "text-faint"} />
      </div>
      <div className="mt-1 text-[14.5px] font-semibold">{name}</div>
      <div className="mt-0.5 text-xs text-muted">{sub}</div>
    </div>
  );
}

function StoreNode({ icon, name, sub }) {
  return (
    <div className="hover-lift flex items-start gap-3 rounded-md bg-ink px-4 py-3 text-[#e8ecf5]">
      <ServiceIcon name={icon} size={18} className="mt-0.5 flex-none text-darksub" />
      <div>
        <div className="text-[13.5px] font-semibold">{name}</div>
        <div className="mt-0.5 text-[11.5px] text-darksub">{sub}</div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Page head */}
      <section className="px-5 pb-10 pt-12 sm:px-14">
        <Reveal>
          <div className="mb-3 font-mono text-xs tracking-[0.1em] text-brand">
            HOW CLOUDPULSE RUNS
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[40px]">
            About & Architecture
          </h1>
          <p className="mt-3 max-w-[620px] text-[15.5px] text-muted">
            Fully serverless on AWS. Nothing to patch, scales to zero, and stays inside the
            Free Tier at team scale.
          </p>
        </Reveal>
      </section>

      {/* Request path */}
      <section className="px-5 pb-2 sm:px-14">
        <Reveal delay={100}>
          <div className="rounded-lg border border-line bg-white px-6 py-8 sm:px-9">
            <div className="mb-6 font-mono text-[11px] tracking-[0.1em] text-faint">
              REQUEST PATH · WHAT HAPPENS WHEN YOU SUBMIT
            </div>

            {/* Desktop: horizontal flow */}
            <div className="hidden items-center gap-0 lg:grid lg:grid-cols-[1fr_34px_1fr_34px_1fr_34px_1fr]">
              {pathNodes.map((n, i) => (
                <div key={n.name} className="contents">
                  <PathNode {...n} />
                  {i < pathNodes.length - 1 && (
                    <div className="text-center font-mono text-sm text-faint">
                      <span className="drift-x">→</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1fr_34px_1fr_34px_1fr_34px_1fr]">
              <div />
              <div />
              <div className="py-1.5 text-center font-mono text-sm text-faint">↑</div>
              <div />
              <div />
              <div />
              <div className="py-1.5 text-center font-mono text-sm text-faint">
                <span className="drift-y">↓</span>
              </div>
            </div>
            <div className="hidden items-start lg:grid lg:grid-cols-[1fr_34px_1fr_34px_1fr_34px_1fr]">
              <div />
              <div />
              <div className="hover-lift rounded-md border border-line px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] tracking-[0.08em] text-faint">IDENTITY</div>
                  <ServiceIcon name="cognito" size={17} className="text-faint" />
                </div>
                <div className="mt-1 text-sm font-semibold">Cognito</div>
                <div className="mt-0.5 text-xs text-muted">Sign-up / sign-in, issues tokens</div>
              </div>
              <div />
              <div className="hover-lift rounded-md border border-line px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] tracking-[0.08em] text-faint">
                    MONITORING
                  </div>
                  <ServiceIcon name="cloudwatch" size={17} className="text-faint" />
                </div>
                <div className="mt-1 text-sm font-semibold">CloudWatch</div>
                <div className="mt-0.5 text-xs text-muted">Logs + alarm on Lambda errors</div>
              </div>
              <div className="pt-3.5 text-center font-mono text-sm text-faint">
                <span className="drift-x">→</span>
              </div>
              <div className="flex flex-col gap-2">
                {stores.map((s) => (
                  <StoreNode key={s.name} {...s} />
                ))}
              </div>
            </div>

            {/* Mobile: vertical flow */}
            <div className="flex flex-col gap-2.5 lg:hidden">
              <PathNode {...pathNodes[0]} />
              <div className="pl-4 font-mono text-[11px] text-faint">
                <span className="drift-y">↓</span> HTTPS
              </div>
              <PathNode {...pathNodes[1]} />
              <div className="pl-4 font-mono text-[11px] text-faint">
                <span className="drift-y">↓</span> Cognito JWT
              </div>
              <PathNode {...pathNodes[2]} />
              <div className="pl-4 font-mono text-[11px] text-faint">
                <span className="drift-y">↓</span>
              </div>
              <PathNode {...pathNodes[3]} />
              <div className="pl-4 font-mono text-[11px] text-faint">
                <span className="drift-y">↓</span> PutItem · DetectSentiment
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {stores.map((s) => (
                  <StoreNode key={s.name} {...s} />
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between rounded-md border border-line bg-panel px-4 py-3">
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <ServiceIcon name="cloudwatch" size={15} className="text-faint" />
                  CloudWatch
                </span>
                <span className="font-mono text-[10px] text-faint">LOGS + 1 ALARM</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Why cards */}
      <section className="grid gap-4 px-5 pb-2 pt-6 sm:grid-cols-2 sm:px-14 lg:grid-cols-4">
        {whyCards.map((c, i) => (
          <Reveal key={c.title} delay={i * 90}>
            <div className="hover-lift h-full rounded-lg border border-line bg-white px-5 py-5">
              <div className="flex items-center gap-2 text-brand">
                <ServiceIcon name={c.icon} size={15} className="flex-none" />
                <div className="font-mono text-[10.5px] tracking-[0.08em] text-faint">
                  {c.title}
                </div>
              </div>
              <div className="mt-2 text-[13px] leading-relaxed text-muted">{c.body}</div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Cost table */}
      <section className="px-5 pb-16 pt-4 sm:px-14">
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-col gap-1 border-b border-line bg-panel px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono text-[11px] tracking-[0.1em] text-faint">
                ESTIMATED MONTHLY COST · 100 USERS · 1,000 CALLS/DAY · 5 GB S3
              </span>
              <span className="font-mono text-[13px] font-semibold text-pos">≈ $1.60 / MO</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {costs.map((c) => (
                <div
                  key={c.name}
                  className="border-b border-r border-line-soft px-6 py-4 lg:border-b-0"
                >
                  <div className="text-[13px] font-semibold">{c.name}</div>
                  <div
                    className={`mt-1 font-mono text-[11.5px] ${c.free ? "text-pos" : "text-muted"}`}
                  >
                    {c.cost}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
