import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'password_resets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('email').notNullable()
      table.string('token').notNullable().unique()
      table.timestamp('expires_at').notNullable()
      table.boolean('used').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.index(['email', 'token'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}