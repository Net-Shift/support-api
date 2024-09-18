import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'
import Account from '#models/account'
import Item from '#models/item'
import Status from '#models/status'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare note: string

  @column()
  declare itemId: string

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>

  @column()
  declare orderId: string

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column()
  declare statusId: string

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

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

