"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Badge from "../../components/Badge";
import FeedbackDrawer from "../../components/FeedbackDrawer";
import Reveal from "../../components/Reveal";
import { fetchFeedback } from "../../lib/api";

const PAGE_SIZE = 3;

const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST" },
  { value: "oldest", label: "OLDEST" },
  { value: "sentiment-desc", label: "SENTIMENT (POS)" },
  { value: "sentiment-asc", label: "SENTIMENT (NEG)" },
];

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const dropdownRef = useRef(null);

  // GET /feedback via API Gateway (falls back to mock data without an API URL)
  const loadItems = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchFeedback()
      .then(setFeedbackItems)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filters = useMemo(
    () => [
      { key: "ALL", label: "All", count: feedbackItems.length },
      { key: "FEATURE", label: "Feature", count: feedbackItems.filter((item) => item.category === "FEATURE").length },
      { key: "BUG", label: "Bug", count: feedbackItems.filter((item) => item.category === "BUG").length },
      { key: "PROCESS", label: "Process", count: feedbackItems.filter((item) => item.category === "PROCESS").length },
      { key: "PRAISE", label: "Praise", count: feedbackItems.filter((item) => item.category === "PRAISE").length },
    ],
    [feedbackItems]
  );

  // Sentiment split computed from items that have a sentiment (Phase 5 fills it)
  const sentimentSplit = useMemo(() => {
    const scored = feedbackItems.filter((item) => item.sentiment);
    if (scored.length === 0) return null;
    const pct = (key) =>
      Math.round((scored.filter((item) => item.sentiment === key).length / scored.length) * 100);
    return { pos: pct("POS"), neu: pct("NEU"), neg: pct("NEG") };
  }, [feedbackItems]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset to page 1 when filter or query changes
  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const filteredItems = feedbackItems.filter((item) => {
    const matchesFilter = filter === "ALL" || item.category === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "sentiment-desc") {
      return (b.sentimentScores?.pos ?? 0) - (a.sentimentScores?.pos ?? 0);
    }
    if (sortBy === "sentiment-asc") {
      return (b.sentimentScores?.neg ?? 0) - (a.sentimentScores?.neg ?? 0);
    }
    return 0;
  });

  const totalFilteredCount = sortedItems.length;
  const totalPages = Math.ceil(totalFilteredCount / PAGE_SIZE) || 1;
  const paginatedItems = sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const from = totalFilteredCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalFilteredCount);

  return (
    <div>
      {/* Page head */}
      <section className="flex flex-col gap-5 px-5 pb-5 pt-11 sm:px-14 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <div className="mb-2.5 font-mono text-xs tracking-[0.1em] text-brand">
            GET /feedback · PUBLIC
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[40px]">Feedback list</h1>
        </Reveal>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-3.5 rounded-[5px] border border-line bg-white px-4 h-[42px] font-mono text-[11px] text-muted">
            <span>{feedbackItems.length} ITEMS</span>
            <span className="text-line">|</span>
            {sentimentSplit ? (
              <>
                <span className="text-pos">POS {sentimentSplit.pos}%</span>
                <span className="text-faint">NEU {sentimentSplit.neu}%</span>
                <span className="text-neg">NEG {sentimentSplit.neg}%</span>
              </>
            ) : (
              <span className="text-faint">SENTIMENT · PHASE 5</span>
            )}
          </div>
          <Link
            href="/submit"
            className="flex items-center justify-center rounded-[5px] bg-brand px-5 h-[42px] text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
          >
            + New feedback
          </Link>
        </div>
      </section>

      {/* Filters + search */}
      <section className="flex flex-col gap-4 px-5 pb-4 pt-3 sm:px-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`whitespace-nowrap rounded-[5px] px-4 h-[38px] flex items-center justify-center text-[13px] transition-colors ${
                filter === key
                  ? "bg-ink font-semibold text-white"
                  : "border border-line bg-white font-medium text-muted hover:border-brand"
              }`}
            >
              {label} · {count}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex w-full items-center gap-2.5 rounded-[5px] border border-line bg-white px-3.5 h-[38px] lg:w-[260px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-faint flex-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or text…"
              className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint"
            />
          </div>
          <div ref={dropdownRef} className="relative w-[170px]">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between whitespace-nowrap rounded-[5px] border border-line bg-white pl-3.5 pr-2.5 h-[38px] font-mono text-[11px] text-muted hover:border-brand hover:text-ink transition-colors cursor-pointer"
            >
              <span>SORT: {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}</span>
              <span className="text-[10px] text-faint">▾</span>
            </button>

            {isOpen && (
              <div className="dropdown-in absolute right-0 mt-1.5 w-full rounded-[5px] border border-line bg-white py-1 shadow-lg shadow-navy/5 z-20">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center px-3.5 py-2 text-left font-mono text-[11px] transition-colors cursor-pointer ${
                      sortBy === opt.value
                        ? "bg-brand-soft text-brand font-semibold"
                        : "text-muted hover:bg-panel hover:text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="px-5 pb-16 sm:px-14">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {loading ? (
            <div className="flex justify-between border-b border-line bg-panel px-6 py-3 font-mono text-[10.5px] tracking-[0.08em] text-faint">
              <span>LOADING · GET /feedback</span>
              <span>SKELETON</span>
            </div>
          ) : (
            <div className="hidden grid-cols-[1fr_110px_70px_130px_100px] gap-4 border-b border-line bg-panel px-6 py-3 font-mono text-[10.5px] tracking-[0.08em] text-faint md:grid">
              <span>TITLE</span>
              <span>CATEGORY</span>
              <span>SENT.</span>
              <span>ATTACHMENT</span>
              <span className="text-right">CREATED</span>
            </div>
          )}

          {loading && (
            <>
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className={`grid animate-pulse items-center gap-3 px-6 py-[19px] md:grid-cols-[1fr_110px_70px_130px_100px] md:gap-4 ${
                    row < 2 ? "border-b border-line-soft" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="h-3 w-1/2 rounded-[3px] bg-line-soft" />
                    <span className="h-2.5 w-3/4 rounded-[3px] bg-neu-soft" />
                  </div>
                  <span className="h-5 w-[70px] rounded-[3px] bg-neu-soft" />
                  <span className="h-5 w-11 rounded-[3px] bg-neu-soft" />
                  <span className="h-2.5 w-16 rounded-[3px] bg-neu-soft" />
                  <span className="h-2.5 w-14 rounded-[3px] bg-neu-soft md:justify-self-end" />
                </div>
              ))}
            </>
          )}

          {!loading && loadError && (
            <div className="pop-in flex flex-col items-center gap-3.5 px-6 py-11 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-neg-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c05a45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8 V13" />
                  <circle cx="12" cy="16.2" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="text-[17px] font-semibold">Couldn't load feedback</div>
              <div className="max-w-[380px] font-mono text-[11.5px] text-muted">{loadError}</div>
              <button
                onClick={loadItems}
                className="mt-1 rounded-[5px] bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !loadError && feedbackItems.length === 0 && (
            <div className="pop-in flex flex-col items-center gap-3.5 px-6 py-11 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-brand-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3d5ac8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5 V19" />
                  <path d="M5 12 H19" />
                </svg>
              </div>
              <div className="text-[17px] font-semibold">Nothing here yet</div>
              <div className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">
                Be the first. The team can't fix what it can't see.
              </div>
              <Link
                href="/submit"
                className="mt-1 rounded-[5px] bg-brand px-5.5 py-2.75 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Submit the first feedback
              </Link>
            </div>
          )}

          {!loading && feedbackItems.length > 0 && totalFilteredCount === 0 && (
            <div className="pop-in flex flex-col items-center gap-3.5 px-6 py-11 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-neu-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8792a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="M15.5 15.5 L20.5 20.5" />
                </svg>
              </div>
              <div className="text-[17px] font-semibold">
                No matches{query.trim() ? ` for "${query.trim()}"` : ""}
              </div>
              <div className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">
                {filter !== "ALL"
                  ? `Check the spelling or clear the ${filters.find((f) => f.key === filter)?.label} filter. ${feedbackItems.length} items are hiding behind it.`
                  : "Check the spelling or try a broader search."}
              </div>
              <div className="mt-1 flex gap-2.5">
                <button
                  onClick={() => setQuery("")}
                  className="rounded-[5px] border border-input-line px-4.5 py-2.25 text-[13px] font-medium transition-colors hover:border-brand"
                >
                  Clear search
                </button>
                <button
                  onClick={() => setFilter("ALL")}
                  className="rounded-[5px] border border-input-line px-4.5 py-2.25 text-[13px] font-medium transition-colors hover:border-brand"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {!loading && paginatedItems.map((item, i) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(item)}
              onKeyDown={(e) => e.key === "Enter" && setSelected(item)}
              className={`pop-in grid cursor-pointer items-center gap-3 px-6 py-4 transition-colors hover:bg-panel md:grid-cols-[1fr_110px_70px_130px_100px] md:gap-4 ${
                i < paginatedItems.length - 1 ? "border-b border-line-soft" : ""
              } ${selected?.id === item.id ? "bg-brand-soft/50 shadow-[inset_3px_0_0_#3d5ac8]" : ""}`}
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <div>
                <div className="text-[15px] font-semibold">{item.title}</div>
                <div className="mt-0.5 text-[12.5px] text-muted">
                  {item.author} · {item.description}
                </div>
              </div>
              <span className="justify-self-start">
                <Badge label={item.category} />
              </span>
              <span className="justify-self-start">
                {item.sentiment ? (
                  <Badge label={item.sentiment} />
                ) : (
                  <span className="font-mono text-[11px] text-faint">·</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-faint">
                {item.attachment ? (
                  <span className="text-brand">⎘ {item.attachment.name}</span>
                ) : (
                  "·"
                )}
              </span>
              <span className="font-mono text-[11.5px] text-faint md:text-right">
                {item.createdAgo}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination (currently static, will connect to API paging) */}
        {!loading && totalFilteredCount > 0 && (
        <div className="flex items-center justify-between px-1 pt-4 font-mono text-[11.5px] text-faint">
          <span>
            SHOWING {from}–{to} OF {totalFilteredCount}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`rounded-[4px] border px-3 py-1.5 transition-colors ${
                page === 1
                  ? "border-line bg-white text-[#c2c9d6] cursor-not-allowed"
                  : "border-line bg-white text-muted hover:border-brand cursor-pointer"
              }`}
            >
              PREV
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`rounded-[4px] border px-3 py-1.5 transition-colors cursor-pointer ${
                    page === pageNum
                      ? "border-brand bg-brand text-white font-semibold"
                      : "border-line bg-white text-muted hover:border-brand"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-[4px] border px-3 py-1.5 transition-colors ${
                page === totalPages
                  ? "border-line bg-white text-[#c2c9d6] cursor-not-allowed"
                  : "border-line bg-white text-muted hover:border-brand cursor-pointer"
              }`}
            >
              NEXT
            </button>
          </div>
        </div>
        )}
      </section>

      {selected && <FeedbackDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
