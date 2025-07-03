import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, belongsTo, hasMany, afterCreate, afterUpdate, afterDelete } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Account from '#models/account'
import Table from '#models/table'
import BaseModel from '#models/base'
import ModelEventEmitter from '#services/websocket/model_events'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare number: number

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @hasMany(() => Table)
  declare tables: HasMany<typeof Table>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
  @beforeCreate()
  public static assignCuid(room: Room) {
    room.id = cuid()
  }

  @afterCreate()
  public static async emitCreatedEvent(room: Room) {
    if (room.accountId) {
      await ModelEventEmitter.emit('Room', 'created', room)
    }
  }

  @afterUpdate()
  public static async emitUpdatedEvent(room: Room) {
    if (room.accountId) {
      await ModelEventEmitter.emit('Room', 'updated', room)
    }
  }

  @afterDelete()
  public static async emitDeletedEvent(room: Room) {
    if (room.accountId) {
      await ModelEventEmitter.emit('Room', 'deleted', room)
    }
  }
}