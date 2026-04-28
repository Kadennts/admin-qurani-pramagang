"use client";

import { useRef } from "react";

type ScrollAmount = number | (() => number);
type ScrollDirection = "left" | "right";

export function useHorizontalScroll(scrollAmount: ScrollAmount) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: ScrollDirection) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const amount =
      typeof scrollAmount === "function" ? scrollAmount() : scrollAmount;

    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return {
    scroll,
    scrollRef,
  };
}
