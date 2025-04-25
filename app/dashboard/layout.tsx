"use client";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GuitarIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  // This effect ensures hydration mismatch is avoided
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <GuitarIcon className="h-6 w-6" />
          <span className="text-lg font-bold">Fretboard Focus</span>
        </Link>
        {/* <div className="ml-auto flex items-center gap-2">
          <UserNav />
        </div> */}
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block border-r px-4 py-6">
          <DashboardNav />
        </aside>
        <main className="flex flex-1 flex-col bg-muted/40 p-5">{children}</main>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <GuitarIcon className="h-6 w-6" />
          <span className="text-lg font-bold">Fretboard Focus</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <DashboardNav />
      </ScrollArea>
    </div>
  );
}
