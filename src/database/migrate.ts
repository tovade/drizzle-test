import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db, client } from "."

await migrate(db, { migrationsFolder: "./drizzle" })
await client.end()
