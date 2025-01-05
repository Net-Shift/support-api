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
    })
})

export const createItem = vine.compile(baseItemSchema)
export const updateItem = vine.compile(baseItemSchema)
// export const updateItem = vine.compile(
//   vine.object(
//     Object.fromEntries(
//       Object.entries(baseItemSchema.getProperties()).map(([key, value]) => [
//         key,
//         value.optional()
//       ])
//     )
//   )
// )
