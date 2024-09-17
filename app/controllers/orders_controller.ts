import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import { createOrder, updateOrder } from '#validators/order'

export default class OrdersController {
/**
  *  Get order by id
  *  @return Object - Order object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      return response.ok(order)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all orders
  *  @return Array - Array of orders
  */
  public async getAll({ response }: HttpContext) {
    try {
      const orders = await Order.query().preload('table').preload('orderItems')
      return response.ok(orders)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Create new order
  *  @return Object - Order object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createOrder)
      const user = auth.getUserOrFail()
      const order = await Order.create({ ...payload, accountId: user!.accountId})
      return response.ok(order)
    } catch (error) {
      console.log('error', error)
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update order 
  *  @return Object - Updated order object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      const payload = await request.validateUsing(updateOrder)
      order.merge(payload)
      await order.save()
      return response.ok(order)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete order 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const order = await Order.findOrFail(params.id)
      await order.delete()
      return response.json({ message: 'order deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}