import { pgTable, serial, varchar, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const validationsTable = pgTable(
  "validations",
  {
    id: serial("id").primaryKey(),
    assumptionId: varchar("assumption_id", { length: 255 }).notNull(),
    userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("validations_assumption_user_idx").on(t.assumptionId, t.userId)],
);

export const errorReportsTable = pgTable("error_reports", {
  id: serial("id").primaryKey(),
  assumptionId: varchar("assumption_id", { length: 255 }).notNull(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Validation = typeof validationsTable.$inferSelect;
export type ErrorReport = typeof errorReportsTable.$inferSelect;
