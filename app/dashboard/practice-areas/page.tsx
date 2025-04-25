"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const practiceAreas = [
  "Warmup",
  "Technique",
  "Scales",
  "Theory",
  "Rhythm",
  "Repertoire",
  "Sight Reading",
  "Improv",
];

export default function PracticeAreasPage() {
  return (
    <div>
      <DashboardHeader
        title="Practice Areas"
        subtitle="Manage the different areas you'll focus on during your practice sessions."
      />

      <div className="grid gap-4">
        {practiceAreas.length === 0 ? (
          <p className="text-muted-foreground">No practice areas available.</p>
        ) : (
          <ul className="grid gap-4">
            {practiceAreas.map((area) => (
              <li
                key={area}
                className="border rounded-xl p-4 shadow-sm bg-background"
              >
                <h3 className="text-lg font-semibold">{area}</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
