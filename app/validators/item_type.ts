import vine from '@vinejs/vine'

const baseItemTypeSchema = vine.object({
  name: vine.string().optional()
})

export const createItemType = vine.compile(
  vine.object({
    ...baseItemTypeSchema.getProperties()
  })
)

export const updateItemType = vine.compile(
  vine.object({
    ...baseItemTypeSchema.getProperties()
  })
)
