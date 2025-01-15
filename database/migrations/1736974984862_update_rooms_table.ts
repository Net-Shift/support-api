import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('width')
      table.integer('height')
      table.integer('number').nullable().alter()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}