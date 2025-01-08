import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tables'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('xStart')
      table.dropColumn('yStart')
      table.integer('x_start')
      table.integer('y_start')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}