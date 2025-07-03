import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, hasMany, beforeCreate, afterCreate, afterUpdate, afterDelete } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Room from '#models/room'
import Account from '#models/account'
import Order from '#models/order'
import BaseModel from '#models/base'
import ModelEventEmitter from '#services/websocket/model_events'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare xStart: number

  @column()
  declare yStart: number

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare seats: number
  
  @column()
  declare roomId: string

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>

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

  @afterCreate()
  public static async emitCreatedEvent(table: Table) {
    if (table.accountId) {
      await ModelEventEmitter.emit('Table', 'created', table)
    }
  }

  @afterUpdate()
  public static async emitUpdatedEvent(table: Table) {
    if (table.accountId) {
      await ModelEventEmitter.emit('Table', 'updated', table)
    }
  }

  @afterDelete()
  public static async emitDeletedEvent(table: Table) {
    if (table.accountId) {
      await ModelEventEmitter.emit('Table', 'deleted', table)
    }
  }
}

