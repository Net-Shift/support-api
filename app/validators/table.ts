import vine from '@vinejs/vine'


const baseTableSchema = vine.object({
  name: vine.string(),
  xStart: vine.number().optional(),
  yStart: vine.number().optional(),
  width: vine.number().optional(),
  height: vine.number().optional(),
  seats: vine.number().optional()
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
  vine.object(
    Object.fromEntries(
      Object.entries(baseTableSchema.getProperties()).map(([key, value]) => [
        key,
        value.optional()
      ])
    )
  )
)
