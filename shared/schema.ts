import { pgTable, text, serial, integer, varchar, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
});

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  lastname: varchar("lastname", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  supervisorId: integer("supervisor_id").references(() => workers.id),
});

export const permits = pgTable("permits", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => workers.id).notNull(),
  permitType: varchar("permit_type", { length: 50 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  supervisorId: integer("supervisor_id").references(() => workers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWorkerSchema = createInsertSchema(workers);

export const insertPermitSchema = createInsertSchema(permits).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Worker = typeof workers.$inferSelect;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type Permit = typeof permits.$inferSelect;
export type InsertPermit = z.infer<typeof insertPermitSchema>;
