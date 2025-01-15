import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status_id')
      table.string('status').notNullable().defaultTo('draft')
      table.dropColumn('item_id')
      table.json('item')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}