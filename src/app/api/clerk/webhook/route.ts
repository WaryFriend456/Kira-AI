// /api/clerk/webhooks

export const POST = async (request:Request)=>{

        const data = await request.json()
        console.log(data)
        console.log("cleark webhook recived ")
        const email = data.email_addresses[0].email

        return new Response("Web Hook received",{status:200})
}


export const GET = async (request:Request)=>{
    return new Response("Web Hook received",{status:200})
}
