import type { HttpContext } from '@adonisjs/core/http'
import OrderItem from '#models/order_item'
import { createOrderItem, updateOrderItem } from '#validators/order_item'

export default class OrderItemsController {
/**
  *  Get orderItem by id
  *  @return Object - OrderItem object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const orderItem = await OrderItem.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(orderItem)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all orderItems
  *  @return Array - Array of orderItems
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const orderItems = await OrderItem.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(orderItems)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new orderItem
  *  @return Object - OrderItem object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createOrderItem)
      const user = auth.getUserOrFail()
      const orderItem = await OrderItem.create({ ...payload, accountId: user!.accountId})
      return response.ok(orderItem)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update orderItem 
  *  @return Object - Updated orderItem object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const orderItem = await OrderItem.findOrFail(params.id)
      const payload = await request.validateUsing(updateOrderItem)
      orderItem.merge(payload)
      await orderItem.save()
      return response.ok(orderItem)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete orderItem 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const orderItem = await OrderItem.findOrFail(params.id)
      await orderItem.delete()
      return response.json({ message: 'orderItem deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}