import {
  BookOpen,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Settings,
  Share2,
  Target,
} from "lucide-react";

import type {
  LandingFeatureIcon,
  LandingSocialIcon,
} from "./landing-home.types";

export function getLandingFeatureIcon(icon: LandingFeatureIcon) {
  switch (icon) {
    case "book-open":
      return BookOpen;
    case "settings":
      return Settings;
    case "target":
      return Target;
  }
}

export function getLandingSocialIcon(icon: LandingSocialIcon) {
  switch (icon) {
    case "globe":
      return Globe;
    case "mail":
      return Mail;
    case "phone":
      return Phone;
    case "message-circle":
      return MessageCircle;
    case "share-2":
      return Share2;
  }
}

export function getYoutubeThumbnailUrl(
  youtubeId: string,
  quality: "maxresdefault" | "hqdefault" = "maxresdefault",
) {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}
