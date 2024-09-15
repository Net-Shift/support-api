import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '#validators/auth'
// import resetPasswordNotification from '#mails/reset_password_notification'

export default class AuthController {
/**
  *  Login user
  *  @return Object - User object
  */
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      return response.ok({
        token: token,
        ...user.serialize(),
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Register new user
  *  @return Object - User object
  */
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const user = await User.create(payload)
      return response.created(user)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Get current user
  *  @return Object - User object
  */
  public async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const result = await User.query().where('id', user.id)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: 'User not found' })
    }
  }

/**
  *  Logout user
  *  @return Object - Success message
  */
  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken.identifier
      if (!token) return response.badRequest({ message: 'Token not found' })
      await User.accessTokens.delete(user, token)
      return response.ok({ message: 'Logged out' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Forgot password
  *  @return Object - Success message
  */
  public async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)
      const user = await User.findBy('email', email)
      if (!user) return response.unprocessableEntity({error: "We can't find a user with that e-mail address."})
      // await resetPasswordNotification(user)
      return { success: 'Please check your email inbox (and spam) for a password reset link.' }
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Reset password
  *  @return Object - Success message
  */
  public async resetPassword({ params, request, response }: HttpContext) {
    try {
      if (!request.hasValidSignature()) return response.unprocessableEntity({ error: 'Invalid reset password link.' })
      const user = await User.find(params.id)
      if (!user) return response.unprocessableEntity({ error: 'Invalid reset password link.' })
      if (encodeURIComponent(user.password) !== params.token) return response.unprocessableEntity({ error: 'Invalid reset password link.' })
      const { password } = await request.validateUsing(resetPasswordValidator)
      user.password = password
      await user.save()
      return { success: 'Password reset successfully.' }
    } catch (error) {
      return response.unauthorized({ error: error.message })
    }
  }
}
