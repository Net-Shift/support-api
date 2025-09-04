import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TagsSchema extends BaseSchema {
  protected tableName = 'tags'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('label').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}