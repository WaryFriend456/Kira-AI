import { db } from "./server/db";


await db.user.create({
    data:{
        email:"test@gmail.com",
        firstName:"test",
        lastName:"test",
    }
})

console.log("done")