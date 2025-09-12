import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table(
  "users",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    firstName: t.text("first_name"),
    lastName: t.text("last_name"),
    email: t.text().notNull(),
  },
  (table) => [
    t.uniqueIndex("email_idx").on(table.email)
  ]
);

export const photos = table(
  "photos",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    slug: t.text().$default(() => generateUniqueString(16)),
    title: t.text(),
    filename: t.text().notNull(),
    filePath: t.text().notNull(),
    fileSize: t.int().notNull(),
    mimeType: t.text().notNull(),
    width: t.int(),
    height: t.int(),
    description: t.text(),
    ownerId: t.int("owner_id").references(() => users.id),
    uploadedAt: t.text("uploaded_at").$default(() => new Date().toISOString()),
  }, (table) => [
    t.uniqueIndex("slug_idx").on(table.slug),
    t.index("owner_id_idx").on(table.ownerId),
    t.index("uploaded_at_idx").on(table.uploadedAt),
  ]);

function generateUniqueString(length: number = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}

