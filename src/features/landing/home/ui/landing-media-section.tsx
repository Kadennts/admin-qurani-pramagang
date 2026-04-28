import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useHorizontalScroll } from "../hooks/use-horizontal-scroll";
import { getYoutubeThumbnailUrl } from "../model/landing-home.utils";
import type { LandingMediaSectionContent } from "../model/landing-home.types";

export function LandingMediaSection({
  section,
  className,
}: {
  section: LandingMediaSectionContent;
  className: string;
}) {
  const { scroll, scrollRef } = useHorizontalScroll(344);

  return (
    <section className={className}>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <h2 className="mb-10 text-3xl font-bold text-slate-900">
          {section.title}
        </h2>

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute top-1/2 -left-4 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-lg transition-all hover:scale-105 hover:text-slate-900 lg:flex"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute top-1/2 right-6 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-lg transition-all hover:scale-105 hover:text-slate-900 xl:-right-4 lg:flex"
        >
          <ChevronRight size={24} />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex snap-x gap-6 overflow-x-auto pb-8 active:cursor-grabbing"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {section.items.map((item) => (
            <a
              key={`${section.title}-${item.youtubeId}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-[280px] max-w-[280px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:min-w-[320px] sm:max-w-[320px]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <Image
                  src={getYoutubeThumbnailUrl(item.youtubeId)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 280px, 320px"
                  unoptimized
                  onError={(event) => {
                    event.currentTarget.src = getYoutubeThumbnailUrl(
                      item.youtubeId,
                      "hqdefault",
                    );
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`mb-2 text-[11px] font-bold tracking-wider uppercase ${section.dateClassName}`}
                >
                  {item.date}
                </span>
                <h3 className="mb-3 flex-1 text-[15px] leading-snug font-bold text-slate-800 transition-colors group-hover:text-emerald-600">
                  {item.title}
                </h3>
                {item.metadata ? (
                  <span className="line-clamp-1 text-[13px] font-medium text-slate-500">
                    {item.metadata}
                  </span>
                ) : null}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-2 flex justify-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow transition-transform hover:text-slate-900 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow transition-transform hover:text-slate-900 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
