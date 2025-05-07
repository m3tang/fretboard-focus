"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export function NavigationMenu() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/icon.svg" // must be in /public
              alt="FretBook logo"
              width={24}
              height={24}
              priority
            />
            <span className="font-bold text-xl text-primary font-heading">
              FretBook
            </span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium"></nav>
        </div>
      </div>
    </header>
  );
}
