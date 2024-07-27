import Elysia from "elysia"
import { usersRoute } from "./routes/users"

export const server = new Elysia()
    .get("/", () => {
        return {
            hello: "world"
        }
    })
    .use(usersRoute)
    .listen(3000)
