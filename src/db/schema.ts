import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const optimizationPlans = pgTable(
  "optimization_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    visitorId: text("visitor_id").notNull(),
    profile: text("profile").notNull(),
    completedSteps: jsonb("completed_steps").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("optimization_plans_visitor_idx").on(table.visitorId)],
);
