import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import User from '#models/user'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare accountType: 'agent' | 'customer'

  @column()
  declare accountReferenceId: string | null

  @belongsTo(() => Account, {
    foreignKey: 'accountReferenceId'
  })
  declare accountAgentId: BelongsTo<typeof Account>

  @hasMany(() => Account, {
    foreignKey: 'accountReferenceId'
  })
  declare accountCustomersIds: HasMany<typeof Account>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(account: Account) {
    account.id = cuid()
  }
}