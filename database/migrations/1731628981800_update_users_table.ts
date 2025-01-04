import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('login_id').unique()
      table.integer('phone').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}