import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { getUpdateValidator, getCreateValidator } from '#validators/auth'
import UserPolicy from '#policies/user_policy'

export default class UsersController {
/**
  *  Get user by id
  *  Only admin can get other users
  *  @return Object - User object
  */
  public async getOne({ auth, params, response, bouncer }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const user = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser),
          scopes.id(params.id),
          scopes.preload()
        }).firstOrFail()
      if (await bouncer.with(UserPolicy).denies('get', user)) {
        return response.badRequest({ error: 'Cannot get the user' })
      }
      return response.ok(user)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all users
  *  Only admin can access this route
  *  @return Array - Array of users
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const users = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser),
          scopes.filters(filters)
        })
        .paginate(page, perPage)
      return response.ok(users)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new user
  *  @return Object - user object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const validator = getCreateValidator(currentUser.profil)
      let payload = await request.validateUsing(validator)
      const user = await User.create({...payload, accountId: currentUser.accountId})
      return response.ok(user)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update user
  *  Only admin can update other users
  *  @return Object - Updated user object
  */
  public  async update({ auth, request, response, params, bouncer }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const validator = getUpdateValidator(currentUser.profil)
      const payload = await request.validateUsing(validator)
      const user = await User.findOrFail(params.id)
      if (await bouncer.with(UserPolicy).denies('edit', user)) {
        return response.badRequest({ error: 'Cannot edit the user' })
      }
      await user.merge(payload).save()
      return response.ok(user)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete user
  *  Only admin can delete other users
  *  @return Object - Success message
  */
  public async delete({ params, response, bouncer }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      if (await bouncer.with(UserPolicy).denies('delete', user)) {
        return response.badRequest({ error: 'Cannot deleted the user' })
      }
      await user.delete()
      return response.json({ message: 'User deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}