import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => userTable.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  done: boolean("done").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});
export type Todo = typeof todoTable.$inferSelect;

export const userTable = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password", { length: 255 }).notNull(),
});

export const sessionTable = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
