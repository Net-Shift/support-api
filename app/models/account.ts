import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import User from '#models/user'
import Room from '#models/room'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Room)
  declare rooms: HasMany<typeof Room>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(account: Account) {
    account.id = cuid()
  }
}