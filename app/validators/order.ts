import vine from '@vinejs/vine'

const baseOrderSchema = vine.object({
  statusId: vine
    .string()
    .exists(async (query, field) => {
      const status = await query.from('statuses').where('id', field).first()
      return !!status
    })
    .optional(),
  itemTypeId: vine
    .string()
    .exists(async (query, field) => {
      const itemType = await query.from('item_types').where('id', field).first()
      return !!itemType
    })
    .optional()
})

export const createOrder = vine.compile(
  vine.object({
    tableId: vine
    .string()
    .exists(async (query, field) => {
      const table = await query.from('tables').where('id', field).first()
      return !!table
    }),
    ...baseOrderSchema.getProperties()
  })
)

export const updateOrder = vine.compile(
  vine.object({
    ...baseOrderSchema.getProperties()
  })
)
