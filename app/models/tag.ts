import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import Account from '#models/account'
import TicketMessage from '#models/ticket_message'


export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare label: string

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @manyToMany(() => TicketMessage, {
    pivotTable: 'ticket_messages_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'ticket_id',
  })
  declare ticketMessages: ManyToMany<typeof TicketMessage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(tag: Tag) {
    tag.id = cuid()
  }
}