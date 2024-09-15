import vine from '@vinejs/vine'

export const createRoom = vine.compile(
  vine.object({
    name: vine.string(),
    number: vine.number().optional(),
  })
)