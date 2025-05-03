// /utils/data/fetchModules.ts
"use server";

import { db } from "@/utils/drizzle/db";
import { modules as modulesTable } from "@/utils/drizzle/schema";
import { Module } from "@/types/modules";

export async function fetchModules(): Promise<Module[]> {
  const results = await db.select().from(modulesTable);

  return results.map((mod) => ({
    id: mod.id,
    name: mod.name,
    description: mod.description ?? undefined,
    isDefault: mod.isDefault,
    userId: mod.userId ?? undefined,
  }));
}
