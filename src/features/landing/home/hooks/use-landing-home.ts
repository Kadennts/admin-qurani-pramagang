"use client";

import { useEffect, useState } from "react";

import { getLandingHomeContent } from "../data/landing-home.repository";

export function useLandingHome() {
  const [content] = useState(() => getLandingHomeContent());
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  return {
    content,
    isScrolled,
    openFaqIndex,
    toggleFaq,
  };
}
