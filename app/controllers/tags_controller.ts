import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { createTag, updateTag } from '#validators/tag'

export default class ItemsController {
/**
  *  Get tag by id
  *  @return Object - Tag object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const tag = await Tag.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(tag)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all tag
  *  @return Object - array of tag and pagination data
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const tag = await Tag.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters)
        })
        .paginate(page, perPage)
      return response.ok(tag)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new tag
  *  @return Object - Tag object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createTag)
      const tag = await Tag.create({ ...payload, accountId: user.accountId })
      return response.ok(tag)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update tag 
  *  @return Object - Updated tag object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const tag = await Tag.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateTag)
      await tag.merge(payload).save()
      return response.ok(tag)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete tag 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const tag = await Tag.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await tag.delete()
      return response.json({ message: 'tag deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}