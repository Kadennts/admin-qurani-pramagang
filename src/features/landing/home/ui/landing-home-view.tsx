import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { useLandingHome } from "../hooks/use-landing-home";
import { LandingFaqSection } from "./landing-faq-section";
import { LandingFeaturesSection } from "./landing-features-section";
import { LandingFooter } from "./landing-footer";
import { LandingMediaSection } from "./landing-media-section";

export function LandingHomeView({
  state,
}: {
  state: ReturnType<typeof useLandingHome>;
}) {
  const { content, isScrolled } = state;

  return (
    <div className="min-h-screen scroll-smooth bg-slate-50 font-sans text-slate-900">
      <header
        className={`fixed left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 transition-all duration-500 ${
          isScrolled ? "top-4" : "top-8"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            isScrolled
              ? "border border-white/10 bg-slate-900/80 shadow-lg backdrop-blur-md"
              : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Image
              src={content.header.logoSrc}
              alt={content.header.logoAlt}
              width={36}
              height={36}
              className="h-8 w-8 object-contain md:h-9 md:w-9"
            />
          </div>
          <Link
            href={content.header.loginHref}
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {content.header.loginLabel}
          </Link>
        </div>
      </header>

      <section className="relative flex h-screen min-h-[500px] w-full items-end overflow-hidden md:items-center">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <Image
            src={content.hero.backgroundImageSrc}
            alt={content.hero.backgroundImageAlt}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20 pb-20 lg:px-12 md:pb-0">
          <h1 className="mb-6 text-5xl leading-[1.1] font-black tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-8xl">
            {content.hero.title} <br />
            <span className="text-emerald-400">{content.hero.accentTitle}</span>
            <div className="mt-4 h-1 w-24 rounded-full bg-white md:w-32" />
          </h1>
          <Link
            href={content.hero.registerHref}
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-slate-900 focus:ring-4 focus:ring-emerald-500/50 md:px-6 md:py-3 md:text-base"
          >
            {content.hero.registerLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFeaturesSection section={content.featuresSection} />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div className="max-w-xl">
            <h2 className="mb-8 text-4xl leading-[1.1] font-bold text-slate-900 sm:text-5xl lg:text-[3.5rem]">
              What&apos;s the <span className="italic">big</span> deal with
              Qurani <span className="italic">Premium</span> anyway?
            </h2>
            <div className="mb-4 text-5xl">
              {content.premiumSection.emoji}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 text-[#00c97b]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    fill="currentColor"
                    className="text-[#00c97b]"
                    size={22}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-500 md:text-base">
                {content.premiumSection.ratingLabel}
              </span>
            </div>
          </div>

          <a
            href={content.premiumSection.videoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-slate-900/5 shadow-xl md:rounded-3xl"
          >
            <Image
              src={content.premiumSection.previewImageSrc}
              alt={content.premiumSection.previewImageAlt}
              width={1200}
              height={900}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute top-1/2 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
              <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-red-600" />
            </div>
          </a>
        </div>
      </section>

      <div className="bg-gradient-to-br from-[#effcf6] to-[#d1f4e0]">
        <LandingMediaSection
          section={content.podcastSection}
          className="relative overflow-hidden pt-24 pb-12"
        />
        <LandingMediaSection
          section={content.blogSection}
          className="relative overflow-hidden pt-12 pb-32"
        />
      </div>

      <LandingFaqSection state={state} />
      <LandingFooter footer={content.footer} />
    </div>
  );
}
