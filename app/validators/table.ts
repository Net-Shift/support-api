import vine from '@vinejs/vine'


const baseTableSchema = vine.object({
  name: vine.string(),
  xStart: vine.number(),
  yStart: vine.number(),
  width: vine.number(),
  height: vine.number(),
  statusId: vine
    .string()
    .exists(async (query, field) => {
      const status = await query.from('statuses').where('id', field).first()
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
