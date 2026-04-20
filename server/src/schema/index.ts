import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  content: text("content").notNull().default("{}"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(contactMessages).omit({ id: true, read: true, createdAt: true });

export const loginLogs = pgTable("login_logs", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  success: boolean("success").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("جديد"), // e.g. "جديد", "حالي", "مكتمل"
  balance: integer("balance").notNull().default(0),
  ordersCompleted: integer("orders_completed").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const timeSessions = pgTable("time_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("جلسة عمل بدون اسم"),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTimeSessionSchema = createInsertSchema(timeSessions).omit({ id: true, createdAt: true });

export type AdminUser = typeof adminUsers.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type LoginLog = typeof loginLogs.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type TimeSession = typeof timeSessions.$inferSelect;
