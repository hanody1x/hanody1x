import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const siteContent = sqliteTable("site_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section: text("section").notNull(),
  content: text("content").notNull().default("{}"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service"),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const insertAdminSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(contactMessages).omit({ id: true, read: true, createdAt: true });

export const loginLogs = sqliteTable("login_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  success: integer("success", { mode: "boolean" }).notNull(),
  attemptedAt: integer("attempted_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  status: text("status").notNull().default("جديد"), // e.g. "جديد", "حالي", "مكتمل"
  balance: integer("balance").notNull().default(0),
  ordersCompleted: integer("orders_completed").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const timeSessions = sqliteTable("time_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default("جلسة عمل بدون اسم"),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTimeSessionSchema = createInsertSchema(timeSessions).omit({ id: true, createdAt: true });

export type AdminUser = typeof adminUsers.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type LoginLog = typeof loginLogs.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type TimeSession = typeof timeSessions.$inferSelect;
