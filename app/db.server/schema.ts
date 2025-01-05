import { randomUUID } from "crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inputs = sqliteTable("inputs", {
	id: text().$defaultFn(randomUUID).primaryKey(),
	time: integer().notNull(),
	award_count: integer().notNull(),
	data: text().notNull(),
	uploaded_at: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	track_id: text().notNull(),
	author_id: text()
		.notNull()
		.references(() => authors.id),
	description: text(),
});

export const authors = sqliteTable("authors", {
	id: text().$defaultFn(randomUUID).primaryKey(),
	username: text().notNull().unique(),
});
