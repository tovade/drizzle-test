// drizzle.config.ts
import type { Config } from "drizzle-kit"

export default {
    schema: "./src/database/schema.ts",
    out: "./drizzle",
    dialect: "postgresql"
    // Include database credentials or other configurations...
} satisfies Config
