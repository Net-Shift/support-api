import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUser, updateUserAdmin } from '#validators/auth'
import UserPolicy from '#policies/user_policy'

export default class UsersController {
/**
  *  Get user by id
  *  Only admin can get other users
  *  @return Object - User object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      if (auth.user?.profil !== 'admin' && auth.user?.profil !== 'superadmin' && auth.user?.id !== params.id) {
        return response.unauthorized({ error: 'You are not authorized to perform this action' })
      }
      const user = await User.findOrFail(params.id)
      const result = await User.query().where('id', user.id).preload('account')
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: 'User not found' })
    }
  }

/**
  *  Get all users
  *  Only admin can access this route
  *  @return Array - Array of users
  */
  public async getAll({ response }: HttpContext) {
    try {
      const users = await User.query()
      return response.ok(users)
    } catch (error) {
      return response.badRequest({ error: 'Users not found' })
    }
  }

/**
  *  Update user
  *  Only admin can update other users
  *  @return Object - Updated user object
  */
  public  async update({ auth, request, response, params, bouncer }: HttpContext) {
    try {
      const validator = auth.user?.profil === 'admin' || auth.user?.profil === 'superadmin'  ? updateUserAdmin : updateUser
      const payload = await request.validateUsing(validator)
      const user = await User.findOrFail(params.id)

      if (await bouncer.with(UserPolicy).denies('edit', user)) {
        return response.badRequest({ error: 'Cannot edit the user' })
      }
      await user.merge(payload).save()
      return response.ok(user)
    } catch (error) {
      return response.badRequest({ error: error })
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
      return response.badRequest({ error: 'User not found' })
    }
  }
}