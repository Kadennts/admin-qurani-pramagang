"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type QuraniLogoProps = {
  collapsed?: boolean;
  className?: string;
  href?: string;
  priority?: boolean;
};

const fullLogoLight = "/icons/Qurani%20-%20Logo%20Green.png";
const fullLogoDark = "/icons/Qurani%20-%20Logo%20White.png";
const iconLogoLight = "/icons/Qurani%20-%20Icon2%20Green.png";
const iconLogoDark = "/icons/Qurani%20-%20Icon2%20White.png";

export function QuraniLogo({
  collapsed = false,
  className,
  href,
  priority = false,
}: QuraniLogoProps) {
  const image = (
    <>
      <Image
        src={collapsed ? iconLogoLight : fullLogoLight}
        alt="Qurani"
        width={collapsed ? 56 : 176}
        height={collapsed ? 56 : 40}
        priority={priority}
        className={cn(
          collapsed
            ? "h-11 w-11 object-contain dark:hidden"
            : "h-8 w-auto object-contain dark:hidden",
          className,
        )}
      />
      <Image
        src={collapsed ? iconLogoDark : fullLogoDark}
        alt="Qurani"
        width={collapsed ? 56 : 176}
        height={collapsed ? 56 : 40}
        priority={priority}
        className={cn(
          collapsed
            ? "hidden h-11 w-11 object-contain dark:block"
            : "hidden h-8 w-auto object-contain dark:block",
          className,
        )}
      />
    </>
  );

  if (!href) {
    return image;
  }

  return (
    <Link href={href} className="inline-flex items-center">
      {image}
    </Link>
  );
}
