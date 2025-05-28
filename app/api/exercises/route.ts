import { NextResponse } from "next/server";
import { db } from "@/utils/drizzle/db";
import { exercises as exercisesTable } from "@/utils/drizzle/schema";

export async function GET() {
  const results = await db.select().from(exercisesTable);

  const parsed = results.map((ex) => ({
    id: ex.id,
    name: ex.name,
    description: ex.description ?? undefined,
    isCustom: ex.isCustom,
    modules: ex.modules,
    userId: ex.userId ?? undefined,
  }));

  return NextResponse.json(parsed);
}
