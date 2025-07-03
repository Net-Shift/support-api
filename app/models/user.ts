import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose, cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, belongsTo, hasOne, afterCreate, afterUpdate, afterDelete } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Account from '#models/account'
import BaseModel from '#models/base'
import ModelEventEmitter from '#services/websocket/model_events'
import QrToken from './qr_token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['login_id', 'email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare profil: 'superadmin' | 'admin' | 'manager' | 'server' | 'chef'

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column()
  declare loginId: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone: string | null

  @column()
  declare accountId: string

  @column()
  declare profileImage: string | null

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @hasOne(() => QrToken)
  declare qrToken: HasOne<typeof QrToken>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  public static assignCuid(user: User) {
    user.id = cuid()
  }

  @afterCreate()
  public static async emitCreatedEvent(user: User) {
    if (user.accountId) {
      await ModelEventEmitter.emit('User', 'created', user)
    }
  }

  @afterUpdate()
  public static async emitUpdatedEvent(user: User) {
    if (user.accountId) {
      await ModelEventEmitter.emit('User', 'updated', user)
    }
  }

  @afterDelete()
  public static async emitDeletedEvent(user: User) {
    if (user.accountId) {
      await ModelEventEmitter.emit('User', 'deleted', user)
    }
  }

  /**
   * Vefiry if the user has an active QR token
   * @returns {Promise<boolean>} - Returns true if an active QR token exists, false otherwise
   */
  public async hasActiveQrToken(): Promise<boolean> {
    const qrToken = await QrToken.query().where('user_id', this.id).where('is_active', true).first()

    return !!qrToken
  }

  /**
   * Get the active QR token for the user
   * @returns {Promise<QrToken | null>} - Returns the active QR token if it exists, null otherwise
   */
  public async getActiveQrToken(): Promise<QrToken | null> {
    return await QrToken.query().where('user_id', this.id).where('is_active', true).first()
  }
}
