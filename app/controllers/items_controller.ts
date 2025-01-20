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
      throw error
    }
  }

/**
  *  Get all items
  *  @return Array - Array of items
  */

  // const transformQuery = (query) => {
  //   const result = {}
    
  //   Object.entries(query).forEach(([key, value]) => {
  //     if (key.includes('_')) {
  //       const [base, prop] = key.split('_')
  //       if (!result[base]) result[base] = {}
        
  //       if (prop === 'values') {
  //         result[base][prop] = Array.isArray(value) ? value : [value]
  //       } else {
  //         result[base][prop] = value
  //       }
  //     } else {
  //       result[key] = value
  //     }
  //   })
    
  //   return result
  // }
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
      throw error
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
      if (payload.tags) await item.related('tags').sync(payload.tags); await item.load('tags')
      await item.refresh()
      return response.ok(item)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update item 
  *  @return Object - Updated item object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const item = await Item.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateItem)
      await item.merge(payload).save() 
      if (payload.tags) await item.related('tags').sync(payload.tags); await item.load('tags')
      return response.ok(item)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete item 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const item = await Item.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await item.delete()
      return response.json({ message: 'item deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}