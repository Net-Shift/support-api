import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { createStatus, updateStatus } from '#validators/status'

export default class ItemsController {
/**
  *  Get status by id
  *  @return Object - Status object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const status = await Status.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(status)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all statuts
  *  @return Array - Array of statuts
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const statuts = await Status.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(statuts)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new status
  *  @return Object - Status object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createStatus)
      const user = auth.getUserOrFail()
      const status = await Status.create({ ...payload, accountId: user!.accountId})
      return response.ok(status)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update status 
  *  @return Object - Updated status object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const status = await Status.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateStatus)
      status.merge(payload)
      await status.save()
      return response.ok(status)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete status 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const status = await Status.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await status.delete()
      return response.json({ message: 'status deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}