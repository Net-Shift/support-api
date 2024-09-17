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
    ...baseOrderItemSchema.getProperties()
  })
)

export const updateOrderItem = vine.compile(
  vine.object({
    ...baseOrderItemSchema.getProperties()
  })
)
