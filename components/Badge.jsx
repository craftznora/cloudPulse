const tones = {
  FEATURE: "text-brand bg-brand-soft",
  BUG: "text-bug bg-bug-soft",
  PROCESS: "text-process bg-process-soft",
  PRAISE: "text-praise bg-praise-soft",
  POS: "text-pos bg-pos-soft",
  NEU: "text-faint bg-neu-soft",
  NEG: "text-neg bg-neg-soft",
};

export default function Badge({ label }) {
  return (
    <span className={`rounded-[3px] px-2 py-1 font-mono text-[11px] ${tones[label] ?? "text-faint bg-neu-soft"}`}>
      {label}
    </span>
  );
}
