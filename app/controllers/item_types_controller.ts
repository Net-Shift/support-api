import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item_type'
import { createItemType, updateItemType } from '#validators/item_type'

export default class ItemsController {
/**
  *  Get itemType by id
  *  @return Object - Item object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const itemType = await Item.findOrFail(params.id)
      return response.ok(itemType)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all itemTypes
  *  @return Array - Array of itemTypes
  */
  public async getAll({ response }: HttpContext) {
    try {
      const itemTypes = await Item.query()
      return response.ok(itemTypes)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Create new itemType
  *  @return Object - Item object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createItemType)
      const user = auth.getUserOrFail()
      const itemType = await Item.create({ ...payload, accountId: user!.accountId})
      return response.ok(itemType)
    } catch (error) {
      console.log('error', error)
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update itemType 
  *  @return Object - Updated itemType object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const itemType = await Item.findOrFail(params.id)
      const payload = await request.validateUsing(updateItemType)
      itemType.merge(payload)
      await itemType.save()
      return response.ok(itemType)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete itemType 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const itemType = await Item.findOrFail(params.id)
      await itemType.delete()
      return response.json({ message: 'itemType deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}