/**
 * Represents a saved practice session in the database.
 * Captures high-level metadata about a completed session.
 */
export type LoggedPracticeSession = {
  id: string; // UUID
  userId: string; // null if anonymous session (optional)
  name: string;
  duration: number; // total session duration in seconds
  startedAt: string; // ISO 8601 timestamp (e.g., Date.toISOString())
  endedAt: string | null; // null if session is still active
};

/**
 * Represents a module that was part of a saved practice session.
 * Includes stored name, order, and duration spent on the module.
 */
export type LoggedPracticeModule = {
  id: string; // UUID
  sessionId: string; // FK to LoggedPracticeSession.id
  module: string; // Module name at time of session
  duration: number; // Duration in seconds
  orderIndex: number;
};

/**
 * Represents an exercise completed during a module in a saved session.
 * Includes denormalized name, original exercise ID, and duration.
 */
export type LoggedPracticeExercise = {
  id: string; // UUID
  moduleId: string; // FK to LoggedPracticeModule.id
  exerciseId: string; // FK to exercises table
  name: string; // Stored name at time of session
  duration: number; // Duration in seconds
  orderIndex: number;
};
