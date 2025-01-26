import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tables'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('seats').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}