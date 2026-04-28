import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useHorizontalScroll } from "../hooks/use-horizontal-scroll";
import { getLandingFeatureIcon } from "../model/landing-home.utils";
import type { LandingFeatureSectionContent } from "../model/landing-home.types";

export function LandingFeaturesSection({
  section,
}: {
  section: LandingFeatureSectionContent;
}) {
  const { scroll, scrollRef } = useHorizontalScroll(() =>
    window.innerWidth < 1024 ? 300 : 340,
  );

  return (
    <section className="relative z-20 overflow-hidden bg-slate-50 py-16 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 lg:flex-row lg:px-12">
        <div className="flex w-full shrink-0 flex-col items-start gap-5 pt-1 lg:w-[280px] xl:w-[320px]">
          <h2 className="text-4xl leading-tight font-bold tracking-tight text-slate-800 md:text-5xl lg:text-[3rem]">
            {section.title}
          </h2>
          <p className="text-sm leading-relaxed font-medium text-slate-500 md:text-base">
            {section.description}
          </p>
          <Link
            href={section.ctaHref}
            className="mt-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-md transition-colors hover:bg-slate-800"
          >
            {section.ctaLabel}
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex w-full grow items-stretch gap-6 overflow-x-auto pb-6 pt-2"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {section.items.map((feature) => {
            const Icon = getLandingFeatureIcon(feature.icon);

            return (
              <div
                key={feature.category}
                className="flex h-auto w-[85vw] shrink-0 flex-col rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:w-[320px] lg:w-[calc((100%-3rem)/3)]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="mb-8 space-y-2">
                  <div
                    className={`${feature.iconBgClassName} mb-4 flex h-10 w-10 items-center justify-center rounded-xl`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {feature.category}
                  </h3>
                  {feature.subtitle ? (
                    <p
                      className={`text-[15px] font-bold ${feature.subtitleClassName}`}
                    >
                      {feature.subtitle}
                    </p>
                  ) : null}
                  <p className="text-[15px] leading-relaxed font-medium text-slate-500">
                    {feature.description}
                  </p>
                </div>

                <div
                  className="relative mt-auto w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <div className="absolute inset-0 bg-slate-100" />
                  <video
                    src={feature.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-md transition-all hover:text-slate-900 hover:shadow-lg"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
