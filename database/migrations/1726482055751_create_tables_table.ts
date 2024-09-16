import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tables'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('name').notNullable()
      table.string('status')
      table.integer('xStart')
      table.integer('yStart')
      table.integer('width')
      table.integer('length')
      table.string('room_id').notNullable().references('rooms.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('account_id').notNullable().references('accounts.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}