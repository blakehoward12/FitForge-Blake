import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  passwordHash: text("password_hash"),
  image: text("image"),
  isPremium: integer("is_premium", { mode: "boolean" }).default(false),
  isCreator: integer("is_creator", { mode: "boolean" }).default(false),
  totalXP: integer("total_xp").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  streak: integer("streak").default(0),
  lastWorkoutDate: text("last_workout_date"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const accounts = sqliteTable("accounts", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (table) => [primaryKey({ columns: [table.identifier, table.token] })]);

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  equipment: text("equipment").notNull(),
  level: text("level").notNull(),
  days: integer("days").notNull(),
  sections: text("sections").notNull(),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const completedSessions = sqliteTable("completed_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutId: text("workout_id"),
  dayLabel: text("day_label"),
  totalVolume: integer("total_volume").default(0),
  totalSets: integer("total_sets").default(0),
  xpEarned: integer("xp_earned").default(0),
  exercises: text("exercises").notNull(),
  completedAt: text("completed_at").$defaultFn(() => new Date().toISOString()),
});

export const feedPosts = sqliteTable("feed_posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  caption: text("caption").notNull(),
  workoutId: text("workout_id"),
  likes: integer("likes").default(0),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementKey: text("achievement_key").notNull(),
  unlockedAt: text("unlocked_at").$defaultFn(() => new Date().toISOString()),
});

export const personalRecords = sqliteTable("personal_records", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  weight: real("weight").notNull(),
  reps: integer("reps").notNull(),
  recordedAt: text("recorded_at").$defaultFn(() => new Date().toISOString()),
});
