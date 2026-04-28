"use client";

import { useLandingHome } from "../hooks/use-landing-home";
import { LandingHomeView } from "./landing-home-view";

export function LandingHome() {
  const state = useLandingHome();

  return <LandingHomeView state={state} />;
}
