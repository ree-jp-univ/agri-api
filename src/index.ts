import { Hono } from 'hono'
import { farmer, orders, packing } from './schema'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/user/order', async (c) => {
  const db = drizzle(c.env.DB)
  try {
    const body = await c.req.json()
    const { userId, vegitable, totalAmount, receivePlace, defaultReceive } = body

    // リクエストバリデーション
    if (
      !userId ||
      !vegitable ||
      totalAmount === undefined ||
      !receivePlace ||
      typeof defaultReceive !== 'boolean'
    ) {
      return c.json({ error: 'Bad request' }, 400)
    }

    const ordersInsert = await db.insert(orders).values({
      userId: parseInt(userId),
      amount: totalAmount,
      receivePlace: receivePlace,
      defaultReceive: defaultReceive ? 1 : 0,
    }).returning({ id: orders.id })
    const orderId = ordersInsert[0].id

    // 農家が取り扱っている野菜リストの取得
    const farmerVesitables = await db.select().from(farmer)

    // farmerVesitables の content に含まれる野菜のみ抽出
    const availableVegitables: Record<number, Record<string, number>> = {}
    for (const [veg, quantity] of Object.entries(vegitable) as [string, number][]) {
      // 複数の farmer レコードがあることを考慮して、いずれかに含まれていれば採用
      let farmer = farmerVesitables.find(f => f.content.includes(veg))
      // 該当する農家がなかったらとりあえず適当な農家に割り振る
      if (!farmer) {
        farmer = farmerVesitables[0]
      }
      if (!availableVegitables[farmer.id]) {
        availableVegitables[farmer.id] = {}
      }
      availableVegitables[farmer.id][veg] = quantity
    }

    // availableVegitables の内容を利用して、農家ごとに packing を登録
    for (const [farmerIdStr, vegs] of Object.entries(availableVegitables)) {
      const farmerId = parseInt(farmerIdStr)
      // packing レコードの挿入
      await db
        .insert(packing)
        .values({
          orderId: orderId,
          farmerId: farmerId,
          content: JSON.stringify(vegs),
        })
    }

    return c.json({ orderId: orderId, message: '注文が登録されました' })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})


app.get('/user/order', async (c) => {
  const db = drizzle(c.env.DB)
  const userIdQuery = c.req.query('userId')
  if (!userIdQuery) {
    return c.json({ error: 'userId is required' }, 400)
  }

  const userIdNum = parseInt(userIdQuery)
  try {
    // 指定ユーザーの orders データを取得
    const ordersResult = await db.select().from(orders).where(eq(orders.userId, userIdNum))
    const orderItems: Array<{
      orderId: number,
      receiveDate: string,
      vegitable: Record<string, number>,
      contents: number,
      totalAmount: number,
      receivePlace: string,
    }> = []

    // 各 order に対して、紐付く packing を取得
    for (const order of ordersResult) {
      const packingsResult = await db.select().from(packing).where(eq(packing.orderId, order.id))
      let date = ''
      let vegitable = {}
      let contents = 0

      // 複数の packing を1つの order でまとめる
      for (const pack of packingsResult) {
        // orderItems.push({
        //   orderId: order.id,
        //   receiveDate: pack.receiveDate,
        //   vegitable: JSON.parse(pack.content),
        //   contents: pack.num ?? 0,
        //   totalAmount: order.amount,
        //   receivePlace: order.receivePlace,
        // })
        date = pack.receiveDate
        vegitable = Object.assign(vegitable, JSON.parse(pack.content))
        contents += pack.num ?? 0
      }
      orderItems.push({
        orderId: order.id,
        receiveDate: date,
        vegitable: vegitable,
        contents: contents,
        totalAmount: order.amount,
        receivePlace: order.receivePlace,
      })
    }
    return c.json({ userId: userIdQuery, order: orderItems })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default app
