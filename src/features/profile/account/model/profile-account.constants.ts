import type { AppProfile } from "@/components/providers/app-preferences-provider";

import type { ProfileNotificationRecipient } from "./profile-account.types";

export const PROFILE_NOTIFICATION_RECIPIENTS: ProfileNotificationRecipient[] = [
  "Admin Dashboard",
  "Support Team",
  "Recitation Reviewer",
];

export const PROFILE_SSR_PLACEHOLDER: Pick<
  AppProfile,
  "name" | "avatar" | "role"
> = {
  name: "Admin",
  avatar: "",
  role: "Admin",
};

export const PROFILE_SESSION_STORAGE_KEY = "qurani-profile";
