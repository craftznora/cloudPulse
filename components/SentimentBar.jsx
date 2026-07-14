"use client";

import { useEffect, useRef, useState } from "react";

/** Sentiment split bar whose segments grow in when scrolled into view. */
export default function SentimentBar({ pos, neu, neg }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex h-2 overflow-hidden rounded-[4px] bg-line-soft">
      <div className="bar-segment bg-pos" style={{ width: active ? `${pos}%` : 0 }} />
      <div className="bar-segment bg-[#c9d2e0]" style={{ width: active ? `${neu}%` : 0 }} />
      <div className="bar-segment bg-neg" style={{ width: active ? `${neg}%` : 0 }} />
    </div>
  );
}
