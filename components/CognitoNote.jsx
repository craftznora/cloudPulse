export default function CognitoNote({ text }) {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-[10.5px] tracking-[0.08em] text-faint">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
        <path d="M8 10.5 V7.5 C8 5.3 9.8 3.5 12 3.5 C14.2 3.5 16 5.3 16 7.5 V10.5" />
      </svg>
      <span className="text-center">{text}</span>
    </div>
  );
}
