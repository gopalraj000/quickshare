import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 4 }).notNull().unique(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: text("size").notNull(),
  data: text("data").notNull(), // Base64 encoded file data
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  code: true,
  expiresAt: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export const fileCodeSchema = z.object({
  code: z.string().length(4),
});

export type FileCode = z.infer<typeof fileCodeSchema>;
