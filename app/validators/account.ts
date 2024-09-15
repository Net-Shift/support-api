import vine from '@vinejs/vine'

export const createAccount = vine.compile(
  vine.object({
    name: vine.string()
  })
)