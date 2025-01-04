import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import { createItem, updateItem } from '#validators/item'

export default class ItemsController {
/**
  *  Get item by id
  *  @return Object - Item object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const item = await Item.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(item)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all items
  *  @return Array - Array of items
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const items = await Item.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(items)
    } catch (error) {
      console.log('error', error)
      return response.badRequest({ error: error })
    }
  }

/**
  *  Create new item
  *  @return Object - Item object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createItem)
      const user = auth.getUserOrFail()
      const item = await Item.create({ ...payload, accountId: user!.accountId})
      return response.ok(item)
    } catch (error) {
      console.log('error', error)
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update item 
  *  @return Object - Updated item object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const item = await Item.findOrFail(params.id)
      const payload = await request.validateUsing(updateItem)
      item.merge(payload)
      await item.save()
      return response.ok(item)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete item 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const item = await Item.findOrFail(params.id)
      await item.delete()
      return response.json({ message: 'item deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}