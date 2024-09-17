import vine from '@vinejs/vine'

const baseOrderItemSchema = vine.object({
  status: vine.string().optional(),
  note: vine.string().optional(),
})

export const createOrderItem = vine.compile(
  vine.object({
    orderId: vine
    .string()
    .exists(async (query, field) => {
      const order = await query.from('orders').where('id', field).first()
      return !!order
    }),
    itemId: vine
    .string()
    .exists(async (query, field) => {
      const item = await query.from('items').where('id', field).first()
      return !!item
    }),
    ...baseOrderItemSchema.getProperties()
  })
)

export const updateOrderItem = vine.compile(
  vine.object({
    ...baseOrderItemSchema.getProperties()
  })
)
