import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ContactTagsSchema extends BaseSchema {
  protected tableName = 'item_tags'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE')
      table.string('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.string('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()

      table.unique(['item_id', 'tag_id'], {
        indexName: 'item_tag_unique',
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}