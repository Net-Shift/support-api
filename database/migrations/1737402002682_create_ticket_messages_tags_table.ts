import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ContactTagsSchema extends BaseSchema {
  protected tableName = 'ticket_messages_tags'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('ticket_id').unsigned().references('id').inTable('ticket_messages').onDelete('CASCADE')
      table.string('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.string('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['ticket_id', 'tag_id'], {
        indexName: 'ticket_tag_unique',
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}