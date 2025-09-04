import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate } from '@adonisjs/lucid/orm'
import BaseModel from '#models/base'

export default class PasswordReset extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare used: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async findValidToken(token: string) {
    const resetToken = await this.query()
      .where('token', token)
      .where('used', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    return resetToken
  }

  static async invalidateToken(token: string) {
    await this.query()
      .where('token', token)
      .update({ used: true })
  }

  static async cleanupExpiredTokens() {
    await this.query()
      .where('expires_at', '<', DateTime.now().toSQL())
      .delete()
  }

  @beforeCreate()
  public static assignCuid(passwordReset: PasswordReset) {
    passwordReset.id = cuid()
  }
}