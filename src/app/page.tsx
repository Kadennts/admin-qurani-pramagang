"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  Target,
  ChevronDown,
  Globe,
  Mail,
  Phone,
  Share2,
  MessageCircle,
} from "lucide-react";

import { QuraniLogo } from "@/components/branding/qurani-logo";

// ─── Feature data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: <BookOpen size={20} />,
    iconBg: "bg-emerald-50 text-emerald-600",
    category: "Memorization",
    subtitle: "Mistake Detection",
    subtitleColor: "text-emerald-600",
    description:
      "Our flagship feature: Qurani's AI will detect missed, incorrect and skipped words in your recitation and alert you in real time.",
    video: "/video/V-1.mp4",
  },
  {
    icon: <Settings size={20} />,
    iconBg: "bg-sky-50 text-sky-600",
    category: "Memorization Planning",
    subtitle: null as string | null,
    subtitleColor: "",
    description:
      "Tailor your memorization journey to your learning style and preferences using Qurani's intuitive planning tools.",
    video: "/video/V-2.mp4",
  },
  {
    icon: <Target size={20} />,
    iconBg: "bg-amber-50 text-amber-600",
    category: "Goals",
    subtitle: null as string | null,
    subtitleColor: "",
    description:
      "Set goals for yourself and track your progress as you memorize the Quran. Stay motivated and focused!",
    video: "/video/V-3.mp4",
  },
];

// ─── Features Section ─────────────────────────────────────────────────────────
// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = window.innerWidth < 1024 ? 300 : 340;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24 relative z-20 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-10">

        {/* ── Left: heading ── */}
        <div className="shrink-0 flex flex-col items-start gap-5 pt-1 w-full lg:w-[280px] xl:w-[320px]">
          <h2 className="text-4xl md:text-5xl lg:text-[3rem] font-bold tracking-tight text-slate-800 leading-tight">
            Memorize more
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
            Make your memorization a premium experience.
          </p>
          <Link
            href="/register"
            className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-md text-sm whitespace-nowrap mt-2"
          >
            Get Started
          </Link>
        </div>

        {/* ── Right: scrollable cards (acts as grid on desktop, scroll on mobile) ── */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 hide-scrollbar grow w-full items-stretch"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="shrink-0 flex flex-col bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-[85vw] sm:w-[320px] lg:w-[calc((100%-3rem)/3)] h-auto"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Text block */}
              <div className="space-y-2 mb-8">
                <div className={`${f.iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{f.category}</h3>
                {f.subtitle && (
                  <p className={`text-[15px] font-bold ${f.subtitleColor}`}>{f.subtitle}</p>
                )}
                <p className="text-[15px] text-slate-500 font-medium leading-relaxed">{f.description}</p>
              </div>

              {/* Video card — pushed to the very bottom so perfectly aligned */}
              <div
                className="mt-auto relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <div className="absolute inset-0 bg-slate-100" />
                <video
                  src={f.video}
                  autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => scroll("left")} aria-label="Scroll left"
          className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-lg transition-all">
          <ChevronLeft size={22} />
        </button>
        <button onClick={() => scroll("right")} aria-label="Scroll right"
          className="w-11 h-11 rounded-full bg-slate-900 shadow-md flex items-center justify-center text-white hover:bg-slate-800 hover:shadow-lg transition-all">
          <ChevronRight size={22} />
        </button>
      </div>

    </section>
  );
}

// ─── Podcast Section ──────────────────────────────────────────────────────────
function PodcastSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 344;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const podcasts = [
    {
      date: "25.07.2025",
      title: "Quran revision Burnout? Try This 20-Minute Plan!",
      ep: "Episode 51",
      youtubeId: "hwig-OJz88Y",
      url: "https://www.youtube.com/watch?v=hwig-OJz88Y"
    },
    {
      date: "27.04.2025",
      title: "How to Practically Do Tadabbur of The Quran",
      ep: "Episode 49",
      youtubeId: "ptmfvHHuXKU",
      url: "https://www.youtube.com/watch?v=ptmfvHHuXKU"
    },
    {
      date: "28.04.2025",
      title: "How to Improve Your Tajweed",
      ep: "Episode 48",
      youtubeId: "Pjwr276ALGU",
      url: "https://www.youtube.com/watch?v=Pjwr276ALGU"
    },
    {
      date: "19.03.2025",
      title: "How to Memorize the Quran with a Busy Schedule",
      ep: "Episode 49",
      youtubeId: "8CJDo4FS-Sg",
      url: "https://www.youtube.com/watch?v=8CJDo4FS-Sg"
    },
    {
      date: "18.11.2025",
      title: "How I Memorized the ENTIRE Quran Just By Listening!",
      ep: "Episode 01",
      youtubeId: "mkoZHW5qUgk",
      url: "https://www.youtube.com/watch?v=mkoZHW5qUgk&t=2s"
    },
  ];

  return (
    <section className="pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">re:Verses Podcast</h2>
        
        {/* Navigation arrows (hidden on mobile, overlay positioned on desktop) */}
        <button 
          onClick={() => scroll("left")} 
          aria-label="Scroll left"
          className="hidden lg:flex absolute -left-4 top-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 z-10 text-slate-500 hover:text-slate-900 transition-all hover:scale-105"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll("right")} 
          aria-label="Scroll right"
          className="hidden lg:flex absolute right-6 xl:-right-4 top-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 z-10 text-slate-500 hover:text-slate-900 transition-all hover:scale-105"
        >
          <ChevronRight size={24} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x cursor-grab active:cursor-grabbing" 
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {podcasts.map((podcast, i) => {
            const parts = podcast.title.split("|");
            const mainTitle = parts[0].trim();
            const author = parts[1] ? parts[1].trim() : "";

            return (
              <a
                key={i}
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] bg-white border border-slate-200 rounded-2xl shrink-0 snap-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col overflow-hidden"
              >
                {/* Thumbnail using YouTube maxresdefault. Fallback to hqdefault internally if error. */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img 
                    src={`https://img.youtube.com/vi/${podcast.youtubeId}/maxresdefault.jpg`}
                    alt={mainTitle}
                    onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${podcast.youtubeId}/hqdefault.jpg`; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 mb-2">
                    {podcast.date}
                  </span>
                  <h3 className="font-bold text-slate-800 leading-snug mb-3 group-hover:text-emerald-600 transition-colors flex-1 text-[15px]">
                    {mainTitle}
                  </h3>
                  <span className="text-[13px] font-medium text-slate-500 line-clamp-1">
                    {author ? `${author} • re:Verses ${podcast.ep}` : `re:Verses ${podcast.ep}`}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
        
        {/* Mobile-only arrows */}
        <div className="flex lg:hidden justify-center gap-4 mt-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95"><ChevronLeft size={20}/></button>
          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95"><ChevronRight size={20}/></button>
        </div>

      </div>
    </section>
  );
}

// ─── Blog Section ─────────────────────────────────────────────────────────────
function BlogSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 344;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const blogs = [
    {
      date: "30.01.2025",
      title: "What Are The Rules of Waqf Wal Ibtida?",
      youtubeId: "XIf0h3uX6OU",
      url: "https://www.youtube.com/watch?v=XIf0h3uX6OU"
    },
    {
      date: "18.08.2025",
      title: "How to Fight Distractions & Memorize the Quran",
      youtubeId: "Kdn2xIYYToM",
      url: "https://www.youtube.com/watch?v=Kdn2xIYYToM"
    },
    {
      date: "17.11.2024",
      title: "What First? Arabic or Quran?",
      youtubeId: "jY4XAavPfdc",
      url: "https://www.youtube.com/watch?v=jY4XAavPfdc"
    },
    {
      date: "03.12.2025",
      title: "Knowing This Will CHANGE How You Memorize the Quran",
      youtubeId: "ArJMe77751w",
      url: "https://www.youtube.com/watch?v=ArJMe77751w"
    },
  ];

  return (
    <section className="pt-12 pb-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Qurani Blog</h2>
        
        {/* Navigation arrows (hidden on mobile, overlay positioned on desktop) */}
        <button 
          onClick={() => scroll("left")} 
          aria-label="Scroll left"
          className="hidden lg:flex absolute -left-4 top-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 z-10 text-slate-500 hover:text-slate-900 transition-all hover:scale-105"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll("right")} 
          aria-label="Scroll right"
          className="hidden lg:flex absolute right-6 xl:-right-4 top-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 z-10 text-slate-500 hover:text-slate-900 transition-all hover:scale-105"
        >
          <ChevronRight size={24} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x cursor-grab active:cursor-grabbing" 
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {blogs.map((blog, i) => {
            const parts = blog.title.split("|");
            const mainTitle = parts[0].trim();
            const author = parts[1] ? parts[1].trim() : "";

            return (
              <a
                key={i}
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] bg-white border border-slate-200 rounded-2xl shrink-0 snap-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col overflow-hidden"
              >
                {/* Thumbnail using YouTube maxresdefault. Fallback to hqdefault internally if error. */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img 
                    src={`https://img.youtube.com/vi/${blog.youtubeId}/maxresdefault.jpg`}
                    alt={mainTitle}
                    onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${blog.youtubeId}/hqdefault.jpg`; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                    {blog.date}
                  </span>
                  <h3 className="font-bold text-slate-800 leading-snug mb-3 group-hover:text-emerald-600 transition-colors flex-1 text-[15px]">
                    {mainTitle}
                  </h3>
                  {author && (
                    <span className="text-[13px] font-medium text-slate-500 line-clamp-1">
                      {author}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
        
        {/* Mobile-only arrows */}
        <div className="flex lg:hidden justify-center gap-4 mt-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95"><ChevronLeft size={20}/></button>
          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 active:scale-95"><ChevronRight size={20}/></button>
        </div>

      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">

      {/* Floating Header */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 transition-all duration-500 ${
          isScrolled ? "top-4" : "top-8"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            isScrolled
              ? "bg-slate-900/80 backdrop-blur-md shadow-lg border border-white/10"
              : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <img src="/icons/qurani-512.png" alt="Qurani Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-white px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative h-screen min-h-[500px] w-full flex items-end md:items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img
            src="/img/hero-bg.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-20 md:pb-0 md:pt-20">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            Memorize <br />
            <span className="text-emerald-400">stronger</span>
            <div className="h-1 w-24 md:w-32 bg-white mt-4 rounded-full" />
          </h1>
          <Link href="/register"
            className="inline-flex items-center gap-2 border-2 border-white/80 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base hover:bg-white hover:text-slate-900 transition-all focus:ring-4 focus:ring-emerald-500/50">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Section 1: Features (video cards) ── */}
      <FeaturesSection />

      {/* ── Section 2: Big Deal Premium ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.1] mb-8">
              What&apos;s the <span className="italic">big</span> deal
              with Qurani <span className="italic">Premium</span>{" "}
              anyway?
            </h2>
            <div className="text-5xl mb-4">😳</div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1 text-[#00c97b]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} fill="currentColor" className="text-[#00c97b]" size={22} strokeWidth={0} />
                ))}
              </div>
              <span className="text-slate-500 font-medium text-sm md:text-base">
                91,000+ 5 Star Reviews
              </span>
            </div>
          </div>

          <a
            href="https://www.youtube.com/watch?v=_XTxAHcIxA0"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-900/5 group"
          >
            <img 
              src="/img/img-statistic.png" 
              alt="Qurani Premium Reviews Video" 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-red-600 ml-1" />
            </div>
          </a>
        </div>
      </section>

      <div className="bg-gradient-to-br from-[#effcf6] to-[#d1f4e0]">
        {/* ── Section 3: Podcast ── */}
        <PodcastSection />

        {/* ── Section 4: Blog ── */}
        <BlogSection />
      </div>

      {/* ── Section 5: FAQs ── */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
              Frequently Asked Questions
            </h2>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-purple-500 rounded-full" />
              <div className="w-8 h-1 bg-purple-200 rounded-full" />
              <div className="w-8 h-1 bg-purple-100 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                q: "What is Qurani?",
                a: "Qurani is a digital platform that helps Muslims memorize the Quran. The application provides a memorization tracking system, progress monitoring, and community features to make your Quran memorization journey easier and more effective.",
              },
              {
                q: "How do I use Qurani?",
                a: "Simply sign up for an account, set your memorization goals, and use our daily tracker to log your progress. Our mobile app makes it easy to read and revise everywhere.",
              },
              {
                q: "Is Qurani free?",
                a: "The core memorization tracking features are completely free. We also offer a Premium subscription with advanced analytics, mistake detection, and detailed planning tools.",
              },
              {
                q: "How do I join a memorization group?",
                a: "Navigate to the Community tab in your dashboard, browse available groups based on your timezone, or create a private group with your friends and family.",
              },
              {
                q: "How does the memorization tracking system work?",
                a: "You can select the Surahs or specific Ayahs you've memorized. The system uses spaced repetition algorithms to remind you when it's time to revise specific portions to prevent forgetting.",
              },
              {
                q: "Are there features to track memorization progress?",
                a: "Yes! Your dashboard displays visual charts of your progress, streaks, total pages memorized, and an estimated completion date based on your pace.",
              },
              {
                q: "How do I add friends on Qurani?",
                a: "You can search for friends in the 'Find Friends' menu and send friend requests. After becoming friends, you can view each other's memorization progress and provide mutual motivation.",
              },
              {
                q: "Are there notifications to remind me about memorization?",
                a: "Yes, Qurani's notification system will remind you about daily memorization reports, friend requests, and group activities. You can customize your notification preferences according to your needs.",
              },
              {
                q: "How do I use the digital mushaf?",
                a: "The digital mushaf is available with easy-to-read Arabic fonts. You can navigate by surah or juz and use features like zoom and bookmark to facilitate the memorization process.",
              },
              {
                q: "Is my memorization data secure?",
                a: "Yes, all your memorization data and personal information are protected with strict security systems. Your data can only be accessed by you and people you authorize within your memorization groups.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                  openFaq === index
                    ? "bg-slate-50 border-slate-300"
                    : "bg-white"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-bold text-slate-800 pr-8">
                    {faq.q}
                  </span>
                  <div
                    className={`transform transition-transform duration-300 flex-shrink-0 text-slate-400 ${
                      openFaq === index ? "rotate-180 text-emerald-600" : ""
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "max-h-[500px] opacity-100 pb-6"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 text-slate-600 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 pt-12 md:pt-20 pb-8  shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-8 mb-12 md:mb-20">
            <div className="col-span-2 space-y-6">
              <QuraniLogo className="h-8" />
              <div className="flex gap-3 flex-wrap">
                {[Globe, Mail, Phone, MessageCircle, Share2].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "PRODUCT", links: ["Pricing", "Gift Cards", "Family Plan", "Mobile App"] },
              { title: "COMPANY", links: ["Blog", "Careers", "Scholarship", "About Us"] },
              { title: "SUPPORT", links: ["Support Center", "Feature Requests", "Contact Us"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-3 text-sm text-slate-500 font-medium">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="hover:text-emerald-600 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-medium text-center sm:text-left">
              Copyright 2026 Qurani, Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs font-medium text-slate-400 flex-wrap justify-center">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">English <ChevronDown size={12} /></span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
