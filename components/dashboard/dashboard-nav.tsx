"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlarmClock,
  BarChart3,
  DumbbellIcon,
  History,
  LayoutDashboard,
  Music,
  Repeat,
  Target,
} from "lucide-react";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useEffect, useState } from "react";
import { useAudioStore } from "@/utils/zustand/audioStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function DashboardNav() {
  const pathname = usePathname();
  const { session, status, elapsedSeconds, currentModuleIndex } =
    usePracticeStore();
  const { unlock } = useAudioStore();

  const [displayTime, setDisplayTime] = useState(elapsedSeconds);

  useEffect(() => {
    if (session) {
      setDisplayTime(elapsedSeconds);
    }
  }, [session, elapsedSeconds]);

  const currentIndex = currentModuleIndex();

  const cta = (() => {
    if (!session || status === "preview") {
      return {
        label: "Start Practice",
        href: "/dashboard/practice/start",
      };
    }

    if (status === "completed" || currentIndex === null) {
      return {
        label: "Practice Complete",
        href: `/dashboard/practice/summary/${session.id}`,
      };
    }

    return {
      label: `${session.modules[currentIndex]?.module}: ${formatTime(displayTime)}`,
      href: `/dashboard/practice/active/${session.id}`,
    };
  })();

  return (
    <nav className="grid gap-2">
      {/* CTA */}
      <Button className="mb-4" onClick={() => unlock()} asChild>
        <Link href={cta.href}>{cta.label}</Link>
      </Button>

      {/* Primary Links - no header */}
      <div className="space-y-1 mb-6">
        <NavItem
          title="Overview"
          href="/dashboard"
          icon={<LayoutDashboard className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Routines"
          href="/dashboard/routines"
          icon={<Repeat className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Metronome"
          href="/dashboard/metronome"
          icon={<AlarmClock className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
      </div>

      {/* Practice & Library */}
      <NavSection title="Library">
        <NavItem
          title="Practice Areas"
          href="/dashboard/practice-areas"
          icon={<Target className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Exercises"
          href="/dashboard/exercises"
          icon={<DumbbellIcon className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Songs"
          href="/dashboard/songs"
          icon={<Music className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
      </NavSection>

      {/* Progress */}
      <NavSection title="Progress">
        <NavItem
          title="Progress"
          href="/dashboard/progress"
          icon={<BarChart3 className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Practice History"
          href="/dashboard/history"
          icon={<History className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
        <NavItem
          title="Goals"
          href="/dashboard/goals"
          icon={<Target className="mr-2 h-4 w-4" />}
          activePath={pathname}
        />
      </NavSection>
    </nav>
  );
}

function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 mb-6">
      <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function NavItem({
  title,
  href,
  icon,
  activePath,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
  activePath: string;
}) {
  return (
    <Button
      variant={activePath === href ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start",
        activePath === href && "bg-muted font-medium"
      )}
      onClick={() => {}}
      asChild
    >
      <Link href={href}>
        {icon}
        {title}
      </Link>
    </Button>
  );
}
