import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BaseModel from '#models/base'
import Account from '#models/account'
import Item from '#models/item'


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

  @manyToMany(() => Item, {
    pivotTable: 'item_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'item_id',
  })
  declare items: ManyToMany<typeof Item>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignCuid(tag: Tag) {
    tag.id = cuid()
  }
}