import type { HttpContext } from '@adonisjs/core/http'
import OrderItem from '#models/order_item'
import { createOrderItem, updateManyOrderItemStatus, updateOrderItem } from '#validators/order_item'
import Item from '#models/item'

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
      const item = await Item.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(payload.itemId),
          scopes.preload()
        })
        .firstOrFail()
      delete payload.itemId
      payload.item = item
      const orderItem = await OrderItem.create({ ...payload, accountId: user!.accountId })
      return response.ok(orderItem)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update orderItem 
  *  @return Object - Updated orderItem object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const orderItem = await OrderItem.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateOrderItem)
      orderItem.merge(payload)
      await orderItem.save()
      return response.ok(orderItem)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update many orderItem status
  *  @return Object - Updated orderItem object
  */
  public async updateManyStatus({ request, response }: HttpContext) {
    try {
      const { orderItemIds, status } = await request.validateUsing(updateManyOrderItemStatus)
      console.log(orderItemIds, status)
      const updatedOrderItems = []
      for (const orderItemId of orderItemIds) {
        const orderItem = await OrderItem.findOrFail(orderItemId)
        orderItem.status = status
        await orderItem.save()
        updatedOrderItems.push(orderItem)
      }
      return response.json({ message: 'orderItems status updated successfully' })
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }

/**
  *  Delete orderItem 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const orderItem = await OrderItem.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await orderItem.delete()
      return response.json({ message: 'orderItem deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}