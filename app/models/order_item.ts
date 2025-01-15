import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'
import Account from '#models/account'
import Item from '#models/item'
import BaseModel from '#models/base'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare note: string

  @column()
  declare item: typeof Item

  @column()
  declare orderId: string

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column()
  declare status: string

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(orderItem: OrderItem) {
    orderItem.id = cuid()
  }
}

