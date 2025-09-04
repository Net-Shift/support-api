import vine from '@vinejs/vine'

export const createTag = vine.compile(
  vine.object({
    name: vine
      .string()
      .unique(async (query, field) => {
        const user = await query.from('tags').where('name', field).first()
        return !user
      }),
    label: vine
      .string()
      .unique(async (query, field) => {
        const user = await query.from('tags').where('label', field).first()
        return !user
      }).optional()
  })
)

export const updateTag = vine.compile(
  vine.object({
    name: vine
      .string()
      .unique(async (query, field) => {
        const user = await query.from('tags').where('name', field).first()
        return !user
      }).optional(),
    label: vine
      .string()
      .unique(async (query, field) => {
        const user = await query.from('tags').where('label', field).first()
        return !user
      }).optional(),
  })
)
