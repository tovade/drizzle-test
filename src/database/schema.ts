import { pgTable, serial, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 256 })
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
