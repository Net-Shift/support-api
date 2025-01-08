import vine from '@vinejs/vine'


const baseTableSchema = vine.object({
  name: vine.string(),
  xStart: vine.number().optional(),
  yStart: vine.number().optional(),
  width: vine.number().optional(),
  length: vine.number().optional(),
  status: vine
    .string()
    .exists(async (query, field) => {
      const status = await query.from('statuses').where('name', field).first()
      return !!status
    })
    .optional()
})

export const createTable = vine.compile(
  vine.object({
    roomId: vine
    .string()
    .exists(async (query, field) => {
      const room = await query.from('rooms').where('id', field).first()
      return !!room
    }),
    ...baseTableSchema.getProperties()
  })
)

export const updateTable = vine.compile(
  vine.object({
    ...baseTableSchema.getProperties(),
  })
)
