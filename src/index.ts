import { Hono } from 'hono'
import user from './user'
import deliver from './deliver'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
  'origin': '*', // Allow all origins
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/user', user)
app.route('/deliver', deliver)

export default app