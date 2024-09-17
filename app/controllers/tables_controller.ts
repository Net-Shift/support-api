import type { HttpContext } from '@adonisjs/core/http'
import Table from '#models/table'
import { createTable, updateTable } from '#validators/table'

export default class TablesController {
/**
  *  Get table by id
  *  @return Object - Table object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const table = await Table.findOrFail(params.id)
      return response.ok(table)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all rooms
  *  @return Array - Array of rooms
  */
  public async getAll({ response }: HttpContext) {
    try {
      const rooms = await Table.query()
      return response.ok(rooms)
    } catch (error) {
      return response.badRequest({ error: error })
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
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update table 
  *  @return Object - Updated table object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const table = await Table.findOrFail(params.id)
      const payload = await request.validateUsing(updateTable)
      table.merge(payload)
      await table.save()
      return response.ok(table)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete table 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const table = await Table.findOrFail(params.id)
      await table.delete()
      return response.json({ message: 'table deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}