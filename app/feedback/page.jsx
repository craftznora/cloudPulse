"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Badge from "../../components/Badge";
import FeedbackDrawer from "../../components/FeedbackDrawer";
import Reveal from "../../components/Reveal";
import { feedbackItems, sentimentSplit, totalSubmissions } from "../../lib/data";

const PAGE_SIZE = 3;

const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST" },
  { value: "oldest", label: "OLDEST" },
  { value: "sentiment-desc", label: "SENTIMENT (POS)" },
  { value: "sentiment-asc", label: "SENTIMENT (NEG)" },
];

const filters = [
  { key: "ALL", label: "All", count: feedbackItems.length },
  { key: "FEATURE", label: "Feature", count: feedbackItems.filter((item) => item.category === "FEATURE").length },
  { key: "BUG", label: "Bug", count: feedbackItems.filter((item) => item.category === "BUG").length },
  { key: "PROCESS", label: "Process", count: feedbackItems.filter((item) => item.category === "PROCESS").length },
  { key: "PRAISE", label: "Praise", count: feedbackItems.filter((item) => item.category === "PRAISE").length },
];

export default function FeedbackPage() {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);

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
      return b.sentimentScores.pos - a.sentimentScores.pos;
    }
    if (sortBy === "sentiment-asc") {
      return b.sentimentScores.neg - a.sentimentScores.neg;
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
          <div className="flex gap-3.5 rounded-[5px] border border-line bg-white px-4 py-2.5 font-mono text-[11px] text-muted">
            <span>{totalSubmissions} ITEMS</span>
            <span className="text-line">|</span>
            <span className="text-pos">POS {sentimentSplit.pos}%</span>
            <span className="text-faint">NEU {sentimentSplit.neu}%</span>
            <span className="text-neg">NEG {sentimentSplit.neg}%</span>
          </div>
          <Link
            href="/submit"
            className="rounded-[5px] bg-brand px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
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
              className={`whitespace-nowrap rounded-[5px] px-4 py-2 text-[13px] transition-colors ${
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
          <div className="flex w-full items-center gap-2 rounded-[5px] border border-line bg-white px-3.5 py-2 lg:w-[260px]">
            <span className="text-[13px] text-faint">⌕</span>
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
              className="flex w-full items-center justify-between whitespace-nowrap rounded-[5px] border border-line bg-white pl-3.5 pr-2.5 py-2 font-mono text-[11px] text-muted hover:border-brand hover:text-ink transition-colors cursor-pointer"
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
          <div className="hidden grid-cols-[1fr_110px_70px_130px_100px] gap-4 border-b border-line bg-panel px-6 py-3 font-mono text-[10.5px] tracking-[0.08em] text-faint md:grid">
            <span>TITLE</span>
            <span>CATEGORY</span>
            <span>SENT.</span>
            <span>ATTACHMENT</span>
            <span className="text-right">CREATED</span>
          </div>

          {totalFilteredCount === 0 && (
            <div className="pop-in px-6 py-10 text-center font-mono text-xs text-faint">
              NO MATCHES · TRY A DIFFERENT FILTER OR SEARCH
            </div>
          )}

          {paginatedItems.map((item, i) => (
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
                <Badge label={item.sentiment} />
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
              ← PREV
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
              NEXT →
            </button>
          </div>
        </div>
      </section>

      {selected && <FeedbackDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
