import vine from '@vinejs/vine'

const baseOrderSchema = vine.object({
  status: vine.string().optional(),
  tableId: vine.string()
})

export const createOrder = vine.compile(
  vine.object({
    ...baseOrderSchema.getProperties()
  })
)

export const updateOrder = vine.compile(
  vine.object({
    ...baseOrderSchema.getProperties(),
    tableId: vine.string().optional()
  })
)
