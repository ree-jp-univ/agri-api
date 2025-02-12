import { Hono } from 'hono'
import user from './user'
const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/user', user)

export default app