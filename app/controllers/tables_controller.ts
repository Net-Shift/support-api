import type { HttpContext } from '@adonisjs/core/http'
import Table from '#models/table'
import { createTable, updateTable } from '#validators/table'

export default class TablesController {
/**
  *  Get table by id
  *  @return Object - Table object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const table = await Table.query()
      .apply((scopes) => {
        scopes.account(user),
        scopes.id(params.id),
        scopes.preload()
      })
      .firstOrFail()
      return response.ok(table)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all tables
  *  @return Array - Array of tables
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const tables = await Table.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(tables)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new table
  *  @return Object - Table object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createTable)
      const user = auth.getUserOrFail()
      const table = await Table.create({ ...payload, accountId: user!.accountId})
      return response.ok(table)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

/**
  *  Update table 
  *  @return Object - Updated table object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const table = await Table.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateTable)
      table.merge(payload)
      await table.save()
      return response.ok(table)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete table 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const table = await Table.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await table.delete()
      return response.json({ message: 'table deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}