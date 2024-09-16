import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from '#models/room'
import Account from '#models/account'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare status: string

  @column()
  declare xStart: number

  @column()
  declare yStart: number

  @column()
  declare width: number

  @column()
  declare length: number

  @column()
  declare roomId: string

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(table: Table) {
    table.id = cuid()
  }
}

