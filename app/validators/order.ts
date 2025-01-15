import vine from '@vinejs/vine'

const baseOrderSchema = vine.object({
  status: vine.enum(['draft', 'pending', 'inprogress', 'ready', 'terminated', 'error']),
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
