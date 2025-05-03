"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { toast } from "@/components/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      toast({
        title: "Session saved!",
        description: "Your practice session was successfully saved.",
      });
    }
  }, [searchParams]);

  return (
    <div>
      <DashboardHeader title="Home" subtitle="Put home stuff here" />
    </div>
  );
}
