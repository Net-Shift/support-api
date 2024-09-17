import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('status')
      table.string('table_id').notNullable().references('tables.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('account_id').notNullable().references('accounts.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}