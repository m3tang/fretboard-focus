import { pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";

// Define the exercises table
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(), // your exercise IDs like "ex-warmup-1"
  name: text("name").notNull(), // exercise name
  description: text("description"), // optional description
  isCustom: boolean("is_custom").notNull().default(false), // whether it's a user-created exercise
  modules: text("modules").array().notNull(), // Postgres TEXT[] column for module names
  userId: uuid("user_id"), // optional owner for custom exercises
});
