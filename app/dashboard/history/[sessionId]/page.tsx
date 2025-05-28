import { notFound } from "next/navigation";
import { fetchPracticeSessionDetail } from "@/utils/data/fetchPracticeSessionDetail";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PracticeSessionDetailPage(props: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await props.params;

  const session = await fetchPracticeSessionDetail(sessionId).catch(() => null);
  if (!session) return notFound();

  return (
    <div className="p-6 space-y-8">
      {/* Back button */}
      <Link
        href="/dashboard/history"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to History
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{session.name}</h1>
        <p className="text-muted-foreground mt-1">
          {format(new Date(session.startTime * 1000), "MMMM d, yyyy")} &middot;{" "}
          {Math.floor(session.duration / 60)} min
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {session.modules.map((mod) => (
          <div
            key={mod.id}
            className="rounded-xl border bg-card text-card-foreground shadow p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{mod.moduleName}</h2>
              <span className="text-sm text-muted-foreground">
                {Math.floor(mod.duration / 60)} min
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc ml-5">
              {mod.exercises
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((ex, i) => (
                  <li key={i}>
                    {ex.name} – {Math.floor(ex.duration / 60)} min
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
