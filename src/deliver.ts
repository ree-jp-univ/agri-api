import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'

const deliver = new Hono<{ Bindings: Env }>()

deliver.post('/packing', async (c) => {
    const db = drizzle(c.env.DB)
    
})

export default deliver