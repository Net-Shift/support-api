import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, belongsTo, beforeCreate, manyToMany, afterCreate, afterUpdate, afterDelete } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import Account from '#models/account'
import ModelEventEmitter from '#services/websocket/model_events'
import ItemType from '#models/item_type'
import Tag from '#models/tag'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare allergens: string[]

  @column()
  declare price: number

  @column()
  declare itemTypeId: string

  @belongsTo(() => ItemType)
  declare itemType: BelongsTo<typeof ItemType>

  @manyToMany(() => Tag, {
    pivotTable: 'item_tags',
    pivotForeignKey: 'item_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>
    constructor() {
      super()
      this.tags = [] as any
    }

  @column()
  declare accountId: string

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(item: Item) {
    item.id = cuid()
  }

  @afterCreate()
  public static async emitCreatedEvent(item: Item) {
    if (item.accountId) {
      await item.load('itemType')
      await ModelEventEmitter.emit('Item', 'created', item)
    }
  }

  @afterUpdate()
  public static async emitUpdatedEvent(item: Item) {
    if (item.accountId) {
      await item.load('itemType')
      await ModelEventEmitter.emit('Item', 'updated', item)
    }
  }

  @afterDelete()
  public static async emitDeletedEvent(item: Item) {
    if (item.accountId) {
      await ModelEventEmitter.emit('Item', 'deleted', item)
    }
  }
}

