import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, beforeCreate, afterCreate, afterUpdate, afterDelete, manyToMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import Account from '#models/account'
import User from '#models/user'
import Tag from '#models/tag'
import ModelEventEmitter from '#services/websocket/model_events'

export default class TicketMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare number: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare isInitial: boolean

  @column()
  declare parentTicketMessageId: string

  @column()
  declare type: 'initial' | 'customerReply' | 'agentReply'

  @column()
  declare status: 'open' | 'closed' | 'pending'

  @column()
  declare accountId: string

  @column()
  declare userId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>
  
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Tag, {
    pivotTable: 'ticket_messages_tags',
    pivotForeignKey: 'ticket_id',
    pivotRelatedForeignKey: 'tag_id'
  })
  declare tags: ManyToMany<typeof Tag>
  constructor() {
    super()
    this.tags = [] as any
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static byAccount = scope(async (query, user) => {
    await user.load('account')
    await user.account.load('accountCustomersIds')
    if (user && user.accountType !== 'customer') query.where('accountId', user.accountId)
    else if (user && user.accountType === 'agent') query.whereIn('accountId', user.account.accountCustomersIds.map((account: { id: string }) => account.id))
  })

  @beforeCreate()
  public static assignCuid(ticket: TicketMessage) {
    ticket.id = cuid()
  }

  @afterCreate()
  public static async emitCreatedEvent(ticketMessage: TicketMessage) {
    if (ticketMessage.accountId) {
      await ModelEventEmitter.emit('TicketMessage', 'created', ticketMessage)
    }
  }

  @afterUpdate()
  public static async emitUpdatedEvent(ticketMessage: TicketMessage) {
    if (ticketMessage.accountId) {
      await ModelEventEmitter.emit('TicketMessage', 'updated', ticketMessage)
    }
  }

  @afterDelete()
  public static async emitDeletedEvent(ticketMessage: TicketMessage) {
    if (ticketMessage.accountId) {
      await ModelEventEmitter.emit('TicketMessage', 'deleted', ticketMessage)
    }
  }
}

