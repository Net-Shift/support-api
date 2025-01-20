import vine from '@vinejs/vine'

const baseItemSchema = vine.object({
  name: vine.string(),
  description: vine.string().optional(),
  allergens: vine.array(vine.string()).optional(),
  price: vine.number(),
  itemTypeId: vine
    .string()
    .exists(async (query, field) => {
      const itemType = await query.from('item_types').where('id', field).first()
      return !!itemType
    }),
  tags: vine.array(
    vine.string()
    .exists(async (query, field) => {
      const tag = await query.from('tags').where('id', field).first()
      return !!tag
    })
  ).optional()
    // .use(tagsExistRule())
})

export const createItem = vine.compile(baseItemSchema)

export const updateItem = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    allergens: vine.array(vine.string()).optional(),
    price: vine.number().optional(),
    itemTypeId: vine
      .string()
      .exists(async (query, field) => {
        const itemType = await query.from('item_types').where('id', field).first()
        return !!itemType
      }).optional(),
    tags: vine.array(
      vine.string()
      .exists(async (query, field) => {
        const tag = await query.from('tags').where('id', field).first()
        return !!tag
      })
    ).optional()
  })
)
