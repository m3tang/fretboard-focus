"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings } from "lucide-react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useEffect, useState } from "react";
import { useAudioStore } from "@/utils/zustand/audioStore";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Metronome",
    href: "/dashboard/metronome",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
  {
    title: "Account",
    href: "/dashboard/account",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function DashboardNav() {
  const pathname = usePathname();
  const { session, isActive, elapsedSeconds, currentModuleIndex } =
    usePracticeStore();
  const { unlock } = useAudioStore();

  // Live ticking state (optional optimization: reduce re-renders)
  const [displayTime, setDisplayTime] = useState(elapsedSeconds);

  useEffect(() => {
    if (!isActive || !session) return;
    const interval = setInterval(() => {
      setDisplayTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, session]);

  const cta =
    isActive && session
      ? {
          label: `${session.modules[currentModuleIndex()]}: ${formatTime(displayTime)}`,
          href: `/dashboard/practice/active/${session.id}`,
        }
      : {
          label: "Start Practice",
          href: "/dashboard/practice/start",
        };

  return (
    <nav className="grid gap-2">
      <Button onClick={() => unlock()} asChild>
        <Link href={cta.href}>{cta.label}</Link>
      </Button>

      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "justify-start",
            pathname === item.href && "bg-muted font-medium"
          )}
          onClick={() => unlock()}
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
