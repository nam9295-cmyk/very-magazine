"use client";

import { useEffect, useRef, useState } from "react";

import type { MagazinePost } from "@/app/page";

type Language = "kor" | "eng";
const COLLAPSED_SUMMARY_HEIGHT = 84;
const ALL_CATEGORY = "__all__";
const UNCATEGORIZED_CATEGORY = "__uncategorized__";
const UNCATEGORIZED_LABEL = "Uncategorized";
const CATEGORY_LABELS: Record<string, string> = {
  패션: "Fashion",
  뷰티: "Beauty",
  컬처: "Culture",
  라이프: "Lifestyle",
  엔터테인먼트: "Entertainment",
  테크: "Tech",
  비즈니스: "Business",
  푸드: "Food",
  여행: "Travel",
  스포츠: "Sports",
  뉴스: "News",
};

function formatSourceLabel(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getCategoryLabel(category?: string) {
  const normalized = category?.trim();

  if (!normalized) {
    return UNCATEGORIZED_LABEL;
  }

  return CATEGORY_LABELS[normalized] || normalized;
}

function formatRelativeTime(value?: string) {
  if (!value) {
    return "";
  }

  const createdAt = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - createdAt);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "방금 전";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  if (diff < day * 2) {
    return "어제";
  }

  if (diff < day * 7) {
    return `${Math.floor(diff / day)}일 전`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(createdAt);
}

function isValidImageUrl(url?: string) {
  if (!url) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function PlaceholderThumb() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#f3ebe2]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f4ede4_0%,#eee3d6_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_14px,rgba(61,43,31,0.045)_14px,rgba(61,43,31,0.045)_28px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(61,43,31,0.02)_0,rgba(61,43,31,0)_45%,rgba(61,43,31,0.03)_100%)]" />
      <div className="absolute inset-0 flex items-center justify-center text-[1.5rem] font-black tracking-[0.22em] text-[#6b4b36]">
        VERY
      </div>
    </div>
  );
}

function LanguageSwitch({
  activeLanguage,
  onChange,
}: {
  activeLanguage: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="inline-flex rounded-[8px] border border-[#dacdbd] bg-[#f7f0e8] p-1">
      <button
        type="button"
        onClick={() => onChange("kor")}
        className={`rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
          activeLanguage === "kor" ? "bg-[#3d2b1f] text-[#fdfcfb]" : "text-[#6f5847]"
        }`}
      >
        KOR
      </button>
      <button
        type="button"
        onClick={() => onChange("eng")}
        className={`rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
          activeLanguage === "eng" ? "bg-[#3d2b1f] text-[#fdfcfb]" : "text-[#6f5847]"
        }`}
      >
        ENG
      </button>
    </div>
  );
}

function PostItem({
  post,
  activeLanguage,
  onLanguageChange,
}: {
  post: MagazinePost;
  activeLanguage: Language;
  onLanguageChange: (language: Language) => void;
}) {
  const title = activeLanguage === "eng" ? post.eng_title || post.title : post.title;
  const summary = activeLanguage === "kor" ? post.kor_summary : post.eng_summary;
  const [imageFailed, setImageFailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [summaryHeight, setSummaryHeight] = useState(COLLAPSED_SUMMARY_HEIGHT);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const showImage = isValidImageUrl(post.image_url) && !imageFailed;

  useEffect(() => {
    const element = measureRef.current;

    if (!element) {
      return;
    }

    const nextHeight = Math.ceil(element.getBoundingClientRect().height);

    setSummaryHeight(nextHeight);
    setIsExpandable(nextHeight > COLLAPSED_SUMMARY_HEIGHT + 4);

    if (nextHeight <= COLLAPSED_SUMMARY_HEIGHT + 4) {
      setIsExpanded(false);
    }
  }, [summary]);

  return (
    <article className="overflow-hidden rounded-[10px] border border-[#e8ddd0] bg-[#fffdfa] shadow-[0_2px_8px_rgba(61,43,31,0.06)]">
      <div className="relative overflow-hidden border-b border-[#efe4d7] bg-[#f7f0e8]">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={title || "Magazine thumbnail"}
            className="aspect-[5/4] w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <PlaceholderThumb />
        )}
        {post.category ? (
          <div className="absolute left-3 top-3 rounded-[8px] border border-[#dccfbd] bg-[#fff8ef] px-2.5 py-1 text-[0.74rem] font-semibold text-[#5b4434]">
            {getCategoryLabel(post.category)}
          </div>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="text-[1.2rem] leading-[1.2] font-bold text-[#3d2b1f] sm:text-[1.28rem]">
          {title || "Untitled"}
        </h2>
        <div className="mt-2 text-[0.78rem] text-[#8c7b6e]">{formatRelativeTime(post.$createdAt)}</div>
        <div className="relative mt-3">
          <div
            className="overflow-hidden transition-[max-height] duration-200 ease-out"
            style={{
              maxHeight: isExpanded
                ? `${Math.max(summaryHeight, COLLAPSED_SUMMARY_HEIGHT)}px`
                : `${COLLAPSED_SUMMARY_HEIGHT}px`,
            }}
          >
            <p
              className={`text-[0.98rem] leading-7 text-[#5c4738] ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {summary || "요약 데이터가 아직 없습니다."}
            </p>
          </div>
          <p
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 invisible text-[0.98rem] leading-7 text-[#5c4738]"
          >
            {summary || "요약 데이터가 아직 없습니다."}
          </p>
        </div>
        {isExpandable ? (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            className="mt-2 text-[0.88rem] font-medium text-[#7a6554] transition-colors duration-150 hover:text-[#3d2b1f]"
          >
            {isExpanded ? "접기" : "...더보기"}
          </button>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f0e6db] pt-4">
          <LanguageSwitch activeLanguage={activeLanguage} onChange={onLanguageChange} />
          <div className="text-right text-[0.78rem] leading-5 text-[#7a6554]">
            {post.category ? <div>{getCategoryLabel(post.category)}</div> : null}
            {post.original_url ? (
              <a
                href={post.original_url}
                target="_blank"
                rel="noreferrer"
                className="block underline decoration-[#cfbeac] underline-offset-3"
              >
                {formatSourceLabel(post.original_url)}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function PostsFeed({
  initialPosts,
  initialError,
}: {
  initialPosts: MagazinePost[];
  initialError: string | null;
}) {
  const posts = initialPosts;
  const error = initialError;
  const [languageByPost, setLanguageByPost] = useState<Record<string, Language>>({});
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const categories = [
    {
      value: ALL_CATEGORY,
      label: "All",
    },
    ...Array.from(
      new Map(
        posts.map((post) => {
          const normalized = post.category?.trim() || UNCATEGORIZED_CATEGORY;

          return [
            normalized,
            {
              value: normalized,
              label: getCategoryLabel(post.category),
            },
          ];
        }),
      ).values(),
    ),
  ];
  const filteredPosts =
    selectedCategory === ALL_CATEGORY
      ? posts
      : posts.filter(
          (post) => (post.category?.trim() || UNCATEGORIZED_CATEGORY) === selectedCategory,
        );

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col overflow-hidden bg-[#fdfcfb] text-[#3d2b1f]">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-60 bg-[repeating-linear-gradient(135deg,transparent,transparent_18px,rgba(61,43,31,0.035)_18px,rgba(61,43,31,0.035)_36px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,252,251,0.96)_0%,rgba(247,240,232,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(61,43,31,0.045),transparent_70%)]" />

        {/* Logo */}
        <div className="relative z-10 p-6">
          <div className="text-[1.1rem] font-black tracking-widest">VERY</div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-5xl text-5xl leading-[1.1] font-extrabold tracking-tighter text-[#3d2b1f] sm:text-7xl lg:text-8xl">
            <span className="block">0% Human. 100% AI.</span>
            <span className="mt-4 block text-[0.9em] font-medium leading-tight text-[#4e392b]">
              Daily tech, design & chocolate inspiration, delivered autonomously every morning.
            </span>
          </h1>
          <p className="mt-12 max-w-2xl font-mono text-sm tracking-tight text-[#8c7b6e]">
            &gt; System Log: An autonomous AI system (VERY-BOT), running on Very Good
            Chocolate&apos;s private server, gathers and publishes trends from around the world.
          </p>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 flex flex-col items-center gap-8 pb-12">
          <div className="text-sm font-medium tracking-[0.2em] text-[#8c7b6e]">
            {filteredPosts.length} POSTS
          </div>
          <div className="animate-pulse text-center text-[#8c7b6e]">
            <div className="text-sm uppercase tracking-[0.3em]">Scroll to Explore</div>
            <div className="mt-2 text-xl">↓</div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="bg-[#fdfcfb] px-4 py-20 text-[#3d2b1f] sm:px-6">
        <div className="mx-auto max-w-xl">
          {!error ? (
            <div className="mb-12 flex justify-center overflow-x-auto pb-4">
              <div className="flex gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setSelectedCategory(category.value)}
                      className={`rounded-full border px-5 py-2 text-sm font-bold transition-all duration-200 ${
                        isSelected
                          ? "border-[#3d2b1f] bg-[#3d2b1f] text-[#fffdfa]"
                          : "border-[#decfbd] bg-[#fffdfa] text-[#6f5847] hover:border-[#bca893]"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {!error && filteredPosts.length === 0 ? (
            <div className="rounded-[10px] border border-[#1a0f08]/10 bg-white/20 px-4 py-12 text-center text-sm font-medium text-[#1a0f08]/40">
              No posts found.
            </div>
          ) : null}

          {!error ? (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <PostItem
                  key={post.$id}
                  post={post}
                  activeLanguage={languageByPost[post.$id] ?? "kor"}
                  onLanguageChange={(language) => {
                    setLanguageByPost((current) => ({
                      ...current,
                      [post.$id]: language,
                    }));
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
