import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose, cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Account from '#models/account'
import BaseModel from '#models/base'


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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  public static assignCuid(user: User) {
    user.id = cuid()
  }
}