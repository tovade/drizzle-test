import Elysia, { t } from "elysia"
import { db } from "../database"
import { eq } from "drizzle-orm"
import { users } from "../database/schema"

export const usersRoute = new Elysia({ prefix: "/users" })
    .get("/", async () => {
        const result = await db.query.users.findMany()

        return {
            error: false,
            data: result
        }
    })
    .get("/:ID", async ({ params }) => {
        const result = await db.query.users.findFirst({
            where: eq(users.id, Number(params.ID))
        })

        if (!result) {
            return {
                error: true,
                message: "no users found"
            }
        }
        return {
            error: false,
            data: {
                user: {
                    id: result.id,
                    username: result.username
                }
            }
        }
    })
    .post(
        "/",
        async ({ body }) => {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, body.id)
            })
            if (existingUser) {
                return {
                    error: true,
                    message: "An user already exists with this ID!"
                }
            }
            const result = await db.insert(users).values(body).returning()

            return {
                error: false,
                data: { user: result[0] }
            }
        },
        {
            body: t.Object({
                id: t.Number(),
                username: t.String()
            })
        }
    )
    .delete("/:ID", async ({ params }) => {
        const user = await db.query.users.findFirst({
            where: eq(users.id, Number(params.ID))
        })

        if (!user) {
            return {
                error: true,
                message: "User with that ID does not exist!"
            }
        }

        await db.delete(users).where(eq(users.id, Number(params.ID)))

        return {
            error: false,
            message: "Deleted user successfully!"
        }
    })
    .patch(
        "/:ID",
        async ({ body, params }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, Number(params.ID))
            })

            if (!user) {
                return {
                    error: true,
                    message: "User with that ID does not exist!"
                }
            }
            if (user.username === body.username) {
                return {
                    error: false,
                    message: "Successfully updated user!",
                    data: {
                        user
                    }
                }
            }
            const newUser = await db
                .update(users)
                .set(body)
                .where(eq(users.id, Number(params.ID)))
                .returning()

            return {
                error: false,
                message: "Successfully updated user!",
                data: {
                    user: newUser
                }
            }
        },
        {
            body: t.Object({
                username: t.String()
            })
        }
    )
