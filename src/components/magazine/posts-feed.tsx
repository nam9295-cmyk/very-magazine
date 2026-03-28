"use client";

import { useEffect, useRef, useState } from "react";

import type { MagazinePost } from "@/app/page";

type Language = "kor" | "eng";
const COLLAPSED_SUMMARY_HEIGHT = 84;

function formatSourceLabel(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
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
            alt={post.title || "Magazine thumbnail"}
            className="aspect-[5/4] w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <PlaceholderThumb />
        )}
        {post.category ? (
          <div className="absolute left-3 top-3 rounded-[8px] border border-[#dccfbd] bg-[#fff8ef] px-2.5 py-1 text-[0.74rem] font-semibold text-[#5b4434]">
            {post.category}
          </div>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="text-[1.2rem] leading-[1.2] font-bold text-[#3d2b1f] sm:text-[1.28rem]">
          {post.title || "Untitled"}
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
            {post.category ? <div>{post.category}</div> : null}
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

  return (
    <main
      className="min-h-screen bg-[#fdfcfb] px-4 py-6 text-[#3d2b1f] sm:px-6"
      style={{
        fontFamily:
          '"Helvetica Neue", "Neue Haas Grotesk Text Pro", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
      }}
    >
      <div className="mx-auto max-w-xl">
        <header className="mb-4 flex items-center justify-between border-b border-[#ece1d4] pb-3">
          <div className="text-[1.8rem] leading-none font-black tracking-[-0.05em]">VERY</div>
          <div className="text-sm text-[#7a6554]">{posts.length} posts</div>
        </header>

        {error ? (
          <div className="rounded-[10px] border border-[#ead6cb] bg-[#fff7f4] px-4 py-3 text-sm text-[#8d4b2f]">
            {error}
          </div>
        ) : null}

        {!error && posts.length === 0 ? (
          <div className="rounded-[10px] border border-[#e8ddd0] bg-[#fffdfa] px-4 py-6 text-sm text-[#7a6554]">
            No posts found.
          </div>
        ) : null}

        {!error ? (
          <section className="space-y-4">
            {posts.map((post) => (
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
          </section>
        ) : null}
      </div>
    </main>
  );
}
