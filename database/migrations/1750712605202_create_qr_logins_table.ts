import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qr_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table
        .string('user_id')
        .notNullable()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('token').notNullable().unique()
      table.boolean('is_active').notNullable().defaultTo(true)
      table
        .string('account_id')
        .notNullable()
        .references('accounts.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['token'])
      table.index(['user_id'])
      table.index(['account_id', 'is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
