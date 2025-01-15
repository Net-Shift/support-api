import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import Account from '#models/account'
import ItemType from '#models/item_type'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare allergens: string[]

  @column()
  declare price: number

  @column()
  declare itemTypeId: string

  @belongsTo(() => ItemType)
  declare itemType: BelongsTo<typeof ItemType>

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(item: Item) {
    item.id = cuid()
  }
}

