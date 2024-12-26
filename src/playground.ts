import { db } from "./server/db";

await db.user.create({
    data: {
        emailAddress: "kushal@gmail.com",
        firstName: "Kushal",
        lastName: "Bang",
    }
})

console.log("Done")