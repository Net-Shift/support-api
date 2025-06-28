import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomBytes } from 'node:crypto'
import BaseModel from '#models/base'
import User from '#models/user'
import Account from '#models/account'

export default class QrToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare token: string

  @column()
  declare isActive: boolean

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(qrToken: QrToken) {
    qrToken.id = cuid()
  }

  @beforeCreate()
  public static generateToken(qrToken: QrToken) {
    qrToken.token = `qr_${randomBytes(32).toString('hex')}`
  }

  /**
   * Find active token by value
   */
  public static async findActiveToken(token: string) {
    return await this.query().where('token', token).where('is_active', true).preload('user').first()
  }

  /**
   * Revoke all tokens of a user
   */
  public static async revokeUserTokens(userId: string) {
    await this.query().where('user_id', userId).update({ is_active: false })
  }
}
