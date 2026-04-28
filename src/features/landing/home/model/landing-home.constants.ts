import type { LandingHomeContent } from "./landing-home.types";

export const LANDING_HOME_CONTENT: LandingHomeContent = {
  header: {
    logoSrc: "/icons/qurani-512.png",
    logoAlt: "Qurani Logo",
    loginHref: "/login",
    loginLabel: "Log in",
  },
  hero: {
    backgroundImageSrc: "/img/hero-bg.png",
    backgroundImageAlt: "Hero Background",
    title: "Memorize",
    accentTitle: "stronger",
    registerHref: "/register",
    registerLabel: "Get Started",
  },
  featuresSection: {
    title: "Memorize more",
    description: "Make your memorization a premium experience.",
    ctaHref: "/register",
    ctaLabel: "Get Started",
    items: [
      {
        icon: "book-open",
        iconBgClassName: "bg-emerald-50 text-emerald-600",
        category: "Memorization",
        subtitle: "Mistake Detection",
        subtitleClassName: "text-emerald-600",
        description:
          "Our flagship feature: Qurani's AI will detect missed, incorrect and skipped words in your recitation and alert you in real time.",
        videoSrc: "/video/V-1.mp4",
      },
      {
        icon: "settings",
        iconBgClassName: "bg-sky-50 text-sky-600",
        category: "Memorization Planning",
        subtitle: null,
        subtitleClassName: "",
        description:
          "Tailor your memorization journey to your learning style and preferences using Qurani's intuitive planning tools.",
        videoSrc: "/video/V-2.mp4",
      },
      {
        icon: "target",
        iconBgClassName: "bg-amber-50 text-amber-600",
        category: "Goals",
        subtitle: null,
        subtitleClassName: "",
        description:
          "Set goals for yourself and track your progress as you memorize the Quran. Stay motivated and focused!",
        videoSrc: "/video/V-3.mp4",
      },
    ],
  },
  premiumSection: {
    heading: "What's the big deal with Qurani Premium anyway?",
    emoji: "\u{1F633}",
    ratingLabel: "91,000+ 5 Star Reviews",
    videoHref: "https://www.youtube.com/watch?v=_XTxAHcIxA0",
    previewImageSrc: "/img/img-statistic.png",
    previewImageAlt: "Qurani Premium Reviews Video",
  },
  podcastSection: {
    title: "re:Verses Podcast",
    dateClassName: "text-emerald-600",
    items: [
      {
        date: "25.07.2025",
        title: "Quran revision Burnout? Try This 20-Minute Plan!",
        metadata: "re:Verses Episode 51",
        youtubeId: "hwig-OJz88Y",
        url: "https://www.youtube.com/watch?v=hwig-OJz88Y",
      },
      {
        date: "27.04.2025",
        title: "How to Practically Do Tadabbur of The Quran",
        metadata: "re:Verses Episode 49",
        youtubeId: "ptmfvHHuXKU",
        url: "https://www.youtube.com/watch?v=ptmfvHHuXKU",
      },
      {
        date: "28.04.2025",
        title: "How to Improve Your Tajweed",
        metadata: "re:Verses Episode 48",
        youtubeId: "Pjwr276ALGU",
        url: "https://www.youtube.com/watch?v=Pjwr276ALGU",
      },
      {
        date: "19.03.2025",
        title: "How to Memorize the Quran with a Busy Schedule",
        metadata: "re:Verses Episode 49",
        youtubeId: "8CJDo4FS-Sg",
        url: "https://www.youtube.com/watch?v=8CJDo4FS-Sg",
      },
      {
        date: "18.11.2025",
        title: "How I Memorized the ENTIRE Quran Just By Listening!",
        metadata: "re:Verses Episode 01",
        youtubeId: "mkoZHW5qUgk",
        url: "https://www.youtube.com/watch?v=mkoZHW5qUgk&t=2s",
      },
    ],
  },
  blogSection: {
    title: "Qurani Blog",
    dateClassName: "text-slate-400",
    items: [
      {
        date: "30.01.2025",
        title: "What Are The Rules of Waqf Wal Ibtida?",
        metadata: null,
        youtubeId: "XIf0h3uX6OU",
        url: "https://www.youtube.com/watch?v=XIf0h3uX6OU",
      },
      {
        date: "18.08.2025",
        title: "How to Fight Distractions & Memorize the Quran",
        metadata: null,
        youtubeId: "Kdn2xIYYToM",
        url: "https://www.youtube.com/watch?v=Kdn2xIYYToM",
      },
      {
        date: "17.11.2024",
        title: "What First? Arabic or Quran?",
        metadata: null,
        youtubeId: "jY4XAavPfdc",
        url: "https://www.youtube.com/watch?v=jY4XAavPfdc",
      },
      {
        date: "03.12.2025",
        title: "Knowing This Will CHANGE How You Memorize the Quran",
        metadata: null,
        youtubeId: "ArJMe77751w",
        url: "https://www.youtube.com/watch?v=ArJMe77751w",
      },
    ],
  },
  faqSection: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Qurani?",
        answer:
          "Qurani is a digital platform that helps Muslims memorize the Quran. The application provides a memorization tracking system, progress monitoring, and community features to make your Quran memorization journey easier and more effective.",
      },
      {
        question: "How do I use Qurani?",
        answer:
          "Simply sign up for an account, set your memorization goals, and use our daily tracker to log your progress. Our mobile app makes it easy to read and revise everywhere.",
      },
      {
        question: "Is Qurani free?",
        answer:
          "The core memorization tracking features are completely free. We also offer a Premium subscription with advanced analytics, mistake detection, and detailed planning tools.",
      },
      {
        question: "How do I join a memorization group?",
        answer:
          "Navigate to the Community tab in your dashboard, browse available groups based on your timezone, or create a private group with your friends and family.",
      },
      {
        question: "How does the memorization tracking system work?",
        answer:
          "You can select the Surahs or specific Ayahs you've memorized. The system uses spaced repetition algorithms to remind you when it's time to revise specific portions to prevent forgetting.",
      },
      {
        question: "Are there features to track memorization progress?",
        answer:
          "Yes! Your dashboard displays visual charts of your progress, streaks, total pages memorized, and an estimated completion date based on your pace.",
      },
      {
        question: "How do I add friends on Qurani?",
        answer:
          "You can search for friends in the 'Find Friends' menu and send friend requests. After becoming friends, you can view each other's memorization progress and provide mutual motivation.",
      },
      {
        question: "Are there notifications to remind me about memorization?",
        answer:
          "Yes, Qurani's notification system will remind you about daily memorization reports, friend requests, and group activities. You can customize your notification preferences according to your needs.",
      },
      {
        question: "How do I use the digital mushaf?",
        answer:
          "The digital mushaf is available with easy-to-read Arabic fonts. You can navigate by surah or juz and use features like zoom and bookmark to facilitate the memorization process.",
      },
      {
        question: "Is my memorization data secure?",
        answer:
          "Yes, all your memorization data and personal information are protected with strict security systems. Your data can only be accessed by you and people you authorize within your memorization groups.",
      },
    ],
  },
  footer: {
    socialLinks: [
      { icon: "globe", href: "#", label: "Website" },
      { icon: "mail", href: "#", label: "Email" },
      { icon: "phone", href: "#", label: "Phone" },
      { icon: "message-circle", href: "#", label: "Chat" },
      { icon: "share-2", href: "#", label: "Share" },
    ],
    columns: [
      {
        title: "PRODUCT",
        links: [
          { label: "Pricing", href: "#" },
          { label: "Gift Cards", href: "#" },
          { label: "Family Plan", href: "#" },
          { label: "Mobile App", href: "#" },
        ],
      },
      {
        title: "COMPANY",
        links: [
          { label: "Blog", href: "#" },
          { label: "Careers", href: "#" },
          { label: "Scholarship", href: "#" },
          { label: "About Us", href: "#" },
        ],
      },
      {
        title: "SUPPORT",
        links: [
          { label: "Support Center", href: "#" },
          { label: "Feature Requests", href: "#" },
          { label: "Contact Us", href: "#" },
        ],
      },
    ],
    copyright: "Copyright 2026 Qurani, Inc. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
    languageLabel: "English",
  },
};
