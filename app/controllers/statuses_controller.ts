import type { HttpContext } from '@adonisjs/core/http'
import Status from '#models/status'
import { createStatus, updateStatus } from '#validators/status'

export default class ItemsController {
/**
  *  Get status by id
  *  @return Object - Status object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const status = await Status.findOrFail(params.id)
      return response.ok(status)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all statuts
  *  @return Array - Array of statuts
  */
  public async getAll({ response }: HttpContext) {
    try {
      const statuts = await Status.query()
      return response.ok(statuts)
    } catch (error) {
      return response.badRequest({ error: error })
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
      console.log('error', error)
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update status 
  *  @return Object - Updated status object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const status = await Status.findOrFail(params.id)
      const payload = await request.validateUsing(updateStatus)
      status.merge(payload)
      await status.save()
      return response.ok(status)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete status 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const status = await Status.findOrFail(params.id)
      await status.delete()
      return response.json({ message: 'status deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}