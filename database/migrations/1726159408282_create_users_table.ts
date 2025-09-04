import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('profil').notNullable()
      table.string('account_type').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.string('login_id').unique()
      table.string('phone').nullable()
      table.text('profile_image').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}