import vine from '@vinejs/vine'

export const createRoom = vine.compile(
  vine.object({
    name: vine.string(),
    number: vine.number().optional(),
  })
)

export const updateRoom = vine.compile(
  vine.object({
    name: vine.string().optional(),
    number: vine.number().optional(),
  })
)