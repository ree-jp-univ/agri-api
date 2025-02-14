import { relations } from 'drizzle-orm';
import { int, sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().default('ユーザー名'),
});

export const places = sqliteTable('places', {
    userId: int().notNull(),
    name: text(),
    address: text().notNull(),
    defaultReceive: int().notNull().default(0)
}, (table) => [primaryKey({ columns: [table.userId, table.address] }),]);

export const orders = sqliteTable('orders', {
    id: int().primaryKey({ autoIncrement: true }),
    userId: int().notNull(),
    amount: int().notNull(),
    receivePlace: text().notNull(),
    defaultReceive: int().notNull()
});

export const packing = sqliteTable('packing', {
    id: int().primaryKey({ autoIncrement: true }),
    orderId: int().notNull(),
    farmerId: int().notNull(),
    // amount: int().notNull(),
    content: text().notNull(),
    num: int(),
    status: int().notNull().default(0),
    // 0: "集荷準備中" | 1: "集荷待ち" | 2: "配送中" | 3: "受取待ち" | 4: "受取完了"
    receiveDate: text().notNull().default('未確定')
})

export const farmer = sqliteTable('farmer', {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    address: text().notNull(),
    content: text().notNull()
})

export const userRelations = relations(users, ({ many }) => ({
    orders: many(orders)
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id]
    }),
    packing: many(packing)
}));

export const packingRelations = relations(packing, ({ one }) => ({
    order: one(orders, {
        fields: [packing.orderId],
        references: [orders.id]
    }),
    farmer: one(farmer, {
        fields: [packing.farmerId],
        references: [farmer.id]
    })
}));

export const farmerRelations = relations(farmer, ({ many }) => ({
    packings: many(packing)
}));