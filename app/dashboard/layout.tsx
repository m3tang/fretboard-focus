"use client";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center gap-4 border-b bg-background px-4 md:px-6">
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
        <div className="flex w-full flex-row justify-between items-center">
          <div>
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <GuitarIcon className="h-6 w-6" />
              <span className="text-lg font-bold">FretBook</span>
            </Link>
          </div>
          <Link href="/dashboard/settings">Settings</Link>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-64px)] w-[220px] border-r bg-background px-4 py-6 overflow-y-auto">
          <DashboardNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-[220px] bg-muted/40 p-5">{children}</main>
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
          <span className="text-lg font-bold">FretBook</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <DashboardNav />
      </ScrollArea>
    </div>
  );
}
