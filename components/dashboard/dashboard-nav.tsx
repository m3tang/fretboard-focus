"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Music, Clock, Settings } from "lucide-react";

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
    title: "Practice Sessions",
    href: "/dashboard/practice",
    icon: <Music className="mr-2 h-4 w-4" />,
  },
  {
    title: "Practice",
    href: "/dashboard/practice/new",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
  {
    title: "Metronome",
    href: "/dashboard/metronome",
    icon: <Clock className="mr-2 h-4 w-4" />,
  },
  // {
  //   title: "Progress",
  //   href: "/dashboard/progress",
  //   icon: <BarChart2 className="mr-2 h-4 w-4" />,
  // },
  // {
  //   title: "Exercise Library",
  //   href: "/dashboard/exercises",
  //   icon: <BookOpen className="mr-2 h-4 w-4" />,
  // },
  // {
  //   title: "Learning Path",
  //   href: "/dashboard/learning",
  //   icon: <GraduationCap className="mr-2 h-4 w-4" />,
  // },

  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: <Settings className="mr-2 h-4 w-4" />,
  // },
  {
    title: "Account",
    href: "/dashboard/account",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "justify-start",
            pathname === item.href && "bg-muted font-medium"
          )}
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
