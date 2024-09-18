import vine from '@vinejs/vine'

const baseStatusSchema = vine.object({
  name: vine.string().optional(),
})

export const createStatus = vine.compile(
  vine.object({
    ...baseStatusSchema.getProperties()
  })
)

export const updateStatus = vine.compile(
  vine.object({
    ...baseStatusSchema.getProperties()
  })
)
