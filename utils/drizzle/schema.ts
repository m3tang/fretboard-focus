import {
  pgTable,
  text,
  boolean,
  integer,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

// exercises table
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isCustom: boolean("is_custom").notNull().default(false),
  modules: text("modules").array().notNull(), // TEXT[]
  userId: uuid("user_id"), // nullable
});

// routines table
export const routines = pgTable("routines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isCustom: boolean("is_custom").notNull().default(false),
  defaultDuration: integer("default_duration").notNull().default(2700), // in seconds (e.g., 45min)
});

// modules table
export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").notNull().default(true),
  userId: uuid("user_id"), // nullable
});

// routine_modules table
export const routineModules = pgTable("routine_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  routineId: uuid("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id),
  weight: integer("weight").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
});

// routine_module_exercises table
export const routineModuleExercises = pgTable(
  "routine_module_exercises",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => routineModules.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    weight: integer("weight").notNull().default(1),
    orderIndex: integer("order_index").notNull(),
  },
  (table) => ({
    uniqueExercisePerModule: unique().on(table.moduleId, table.exerciseId),
  })
);

export const practiceSessions = pgTable("practice_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  routine_id: text("routine_id").references(() => routines.id),
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // total session duration (in seconds)
  start_time: integer("start_time").notNull(), // Unix timestamp
});

export const practiceSessionModules = pgTable("practice_session_modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  session_id: uuid("session_id")
    .notNull()
    .references(() => practiceSessions.id, { onDelete: "cascade" }),
  module_id: uuid("module_id")
    .notNull()
    .references(() => modules.id),
  duration: integer("duration").notNull(), // in seconds
  order_index: integer("order_index").notNull(),
});

export const practiceSessionExercises = pgTable("practice_session_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  module_session_id: uuid("module_session_id")
    .notNull()
    .references(() => practiceSessionModules.id, { onDelete: "cascade" }),
  exercise_id: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  duration: integer("duration").notNull(), // in seconds
  order_index: integer("order_index").notNull(),
});
