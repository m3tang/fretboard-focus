"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { PracticeSessionListItem } from "@/utils/data/fetchPracticeSessionList";

type Props = {
  sessions: PracticeSessionListItem[];
  isPreview?: boolean;
};

import { useRouter } from "next/navigation";

export function PracticeSessionListTable({
  sessions,
  isPreview = false,
}: Props) {
  const router = useRouter();
  if (sessions.length === 0) {
    return <p className="text-muted-foreground">No practice sessions found.</p>;
  }

  if (isPreview) {
    sessions = sessions.slice(0, 6);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none">
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow
            key={session.id}
            onClick={
              !isPreview
                ? () => router.push(`/dashboard/history/${session.id}`)
                : undefined
            }
            className={
              isPreview
                ? "pointer-events-none bg-background"
                : "cursor-pointer hover:bg-muted transition"
            }
          >
            <TableCell>
              {format(new Date(session.startTime * 1000), "MMM d, yyyy")}
            </TableCell>
            <TableCell>{session.name}</TableCell>
            <TableCell className="text-right">
              {Math.floor(session.duration / 60)} min
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
