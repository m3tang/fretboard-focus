import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-1", className)}>
      <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm lg:text-base">{subtitle}</p>
      )}
    </div>
  );
}
