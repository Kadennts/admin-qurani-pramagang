export type LandingFeatureIcon = "book-open" | "settings" | "target";

export type LandingSocialIcon =
  | "globe"
  | "mail"
  | "phone"
  | "message-circle"
  | "share-2";

export interface LandingHeaderContent {
  logoSrc: string;
  logoAlt: string;
  loginHref: string;
  loginLabel: string;
}

export interface LandingHeroContent {
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  title: string;
  accentTitle: string;
  registerHref: string;
  registerLabel: string;
}

export interface LandingFeatureItem {
  icon: LandingFeatureIcon;
  iconBgClassName: string;
  category: string;
  subtitle: string | null;
  subtitleClassName: string;
  description: string;
  videoSrc: string;
}

export interface LandingFeatureSectionContent {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  items: LandingFeatureItem[];
}

export interface LandingPremiumContent {
  heading: string;
  emoji: string;
  ratingLabel: string;
  videoHref: string;
  previewImageSrc: string;
  previewImageAlt: string;
}

export interface LandingMediaItem {
  date: string;
  title: string;
  metadata: string | null;
  youtubeId: string;
  url: string;
}

export interface LandingMediaSectionContent {
  title: string;
  dateClassName: string;
  items: LandingMediaItem[];
}

export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingFaqSectionContent {
  title: string;
  items: LandingFaqItem[];
}

export interface LandingFooterSocialLink {
  icon: LandingSocialIcon;
  href: string;
  label: string;
}

export interface LandingFooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface LandingFooterContent {
  socialLinks: LandingFooterSocialLink[];
  columns: LandingFooterColumn[];
  copyright: string;
  legalLinks: Array<{
    label: string;
    href: string;
  }>;
  languageLabel: string;
}

export interface LandingHomeContent {
  header: LandingHeaderContent;
  hero: LandingHeroContent;
  featuresSection: LandingFeatureSectionContent;
  premiumSection: LandingPremiumContent;
  podcastSection: LandingMediaSectionContent;
  blogSection: LandingMediaSectionContent;
  faqSection: LandingFaqSectionContent;
  footer: LandingFooterContent;
}
