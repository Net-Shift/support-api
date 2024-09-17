import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Table from '#models/table'
import Account from '#models/account'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare status: string

  @column()
  declare tableId: string

  @belongsTo(() => Table)
  declare table: BelongsTo<typeof Table>

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(order: Order) {
    order.id = cuid()
  }
}

