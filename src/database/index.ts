import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./schema"

export const client = new Client({
    connectionString: process.env.POSTGRES_URL
})

await client.connect().then(() => {
    console.log("connection ready")
})
export const db = drizzle(client, { schema })
