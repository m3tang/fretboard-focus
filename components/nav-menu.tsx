"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GuitarIcon } from "lucide-react";

export function NavigationMenu() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <img src="icon.svg" alt="My Icon" width={24} height={24} />

            <span className="font-bold text-xl text-primary font-heading">
              FretBook
            </span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {/* <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link> */}
            {/* <Link
              href="/features"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/features"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/pricing"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Pricing
            </Link> */}
          </nav>
        </div>
      </div>
    </header>
  );
}
