import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import { createOrder, updateOrder } from '#validators/order'

export default class OrdersController {
/**
  *  Get order by id
  *  @return Object - Order object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const order = await Order.query()
      .apply((scopes) => {
        scopes.account(user),
        scopes.id(params.id),
        scopes.preload()
      })
      .firstOrFail()
      return response.ok(order)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all orders
  *  @return Array - Array of orders
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const orders = await Order.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(orders)
    } catch (error) {
      throw error
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
      throw error
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
      throw error
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
      throw error
    }
  }
}