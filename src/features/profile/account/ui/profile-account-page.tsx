"use client";

import { useProfileAccount } from "../hooks/use-profile-account";
import { ProfileAccountView } from "./profile-account-view";

export function ProfileAccountPage() {
  const state = useProfileAccount();

  return <ProfileAccountView state={state} />;
}
