import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ticket_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('number')
      table.string('title')
      table.string('description')
      table.boolean('is_initial')
      table.string('parent_ticket_message_id')
      table.string('type')
      table.string('account_id').notNullable().references('accounts.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('user_id').notNullable().references('users.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}