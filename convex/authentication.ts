import { mutation, query } from "./_generated/server";

export const get = query(async ({db}) => {
    return await db.query("authentication_tbl").collect()
})

export const validatedEmailExist = query(async ({db}, {email}) => {
    const emailValidation = await db
    .query("authentication_tbl")
    .filter((q) => q.eq(q.field("email"), email))
    .first()

    return !!emailValidation
})

export const createAcc = mutation(
    async ({db}, {user_name, email, password}) => {
        
    return await db.insert("authentication_tbl", {
        user_name,
        email,
        password
    })
})

export const validateLogInCredentials = query( async ({db}, {email, password}) => {
    const user = await db
    .query("authentication_tbl")
    .filter((q) => 
        q.and(
            q.eq(q.field("email"), email),
            q.eq(q.field("password"), password)
        ))
    .first()

    if(!user) return { success:false, reason: "email_not_found"}

    return { success: true}
})