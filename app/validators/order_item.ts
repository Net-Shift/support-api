import vine from '@vinejs/vine'

const baseOrderItemSchema = vine.object({
  note: vine.string().optional(),
  status: vine.enum(['draft', 'pending', 'inprogress', 'ready', 'served', 'terminated', 'error']),
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
    }).optional(),
    item: vine.object({}).optional(),

    ...baseOrderItemSchema.getProperties()
  })
)

export const updateOrderItem = vine.compile(
  vine.object({
    ...baseOrderItemSchema.getProperties()
  })
)

export const updateManyOrderItemStatus = vine.compile(
  vine.object({
    orderItemIds: vine.array(vine.string()),
    status: vine.enum(['draft', 'pending', 'inprogress', 'ready', 'served', 'terminated', 'error']),
  })
)
