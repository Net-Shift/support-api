import type { HttpContext } from '@adonisjs/core/http'
import ItemType from '#models/item_type'
import { createItemType, updateItemType } from '#validators/item_type'

export default class ItemsController {
/**
  *  Get itemType by id
  *  @return Object - ItemType object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const itemType = await ItemType.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(itemType)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all itemTypes
  *  @return Object - array of itemTypes and pagination data
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const itemTypes = await ItemType.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters)
        })
        .paginate(page, perPage)
      return response.ok(itemTypes)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new itemType
  *  @return Object - ItemType object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createItemType)
      const user = auth.getUserOrFail()
      const itemType = await ItemType.create({ ...payload, accountId: user.accountId})
      return response.ok(itemType)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update itemType 
  *  @return Object - Updated itemType object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const itemType = await ItemType.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateItemType)
      await itemType.merge(payload).save()
      return response.ok(itemType)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete itemType 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const itemType = await ItemType.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await itemType.delete()
      return response.json({ message: 'itemType deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}