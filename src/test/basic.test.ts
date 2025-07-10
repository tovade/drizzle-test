import { describe, it, expect } from "bun:test"

describe("Basic Tests", () => {
    it("should pass a simple test", () => {
        expect(1 + 1).toBe(2)
    })

    it("should validate package imports work", async () => {
        // Test that we can import our main modules
        const { users } = await import("../database/schema")
        expect(users).toBeDefined()
        
        const Elysia = (await import("elysia")).default
        expect(Elysia).toBeDefined()
    })
})