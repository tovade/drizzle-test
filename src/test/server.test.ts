import { describe, it, expect, beforeAll, afterAll } from "bun:test"
import { server } from "../index"
import { db, client } from "../database"
import { users } from "../database/schema"

describe("API Server Tests", () => {
    beforeAll(async () => {
        // Clean up test data before running tests
        await db.delete(users)
    })

    afterAll(async () => {
        // Clean up after tests
        await db.delete(users)
        await client.end()
        server.stop()
    })

    describe("Health Check", () => {
        it("should return hello world", async () => {
            const response = await server.handle(new Request("http://localhost:3000/"))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data).toEqual({ hello: "world" })
        })
    })

    describe("Users API", () => {
        it("should return empty users list initially", async () => {
            const response = await server.handle(new Request("http://localhost:3000/users"))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.data).toEqual([])
        })

        it("should create a new user", async () => {
            const newUser = { id: 1, username: "testuser" }
            const response = await server.handle(new Request("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            }))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.data.user.username).toBe("testuser")
            expect(data.data.user.id).toBe(1)
        })

        it("should get a user by ID", async () => {
            const response = await server.handle(new Request("http://localhost:3000/users/1"))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.data.user.username).toBe("testuser")
            expect(data.data.user.id).toBe(1)
        })

        it("should return all users", async () => {
            const response = await server.handle(new Request("http://localhost:3000/users"))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.data).toHaveLength(1)
            expect(data.data[0].username).toBe("testuser")
        })

        it("should update a user", async () => {
            const updateData = { username: "updateduser" }
            const response = await server.handle(new Request("http://localhost:3000/users/1", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            }))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.message).toBe("Successfully updated user!")
        })

        it("should delete a user", async () => {
            const response = await server.handle(new Request("http://localhost:3000/users/1", {
                method: "DELETE"
            }))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(false)
            expect(data.message).toBe("Deleted user successfully!")
        })

        it("should return error when getting non-existent user", async () => {
            const response = await server.handle(new Request("http://localhost:3000/users/999"))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(true)
            expect(data.message).toBe("no users found")
        })

        it("should return error when creating user with existing ID", async () => {
            // First create a user
            await server.handle(new Request("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: 2, username: "user2" })
            }))

            // Try to create another user with same ID
            const response = await server.handle(new Request("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: 2, username: "duplicate" })
            }))
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.error).toBe(true)
            expect(data.message).toBe("An user already exists with this ID!")
        })
    })
})