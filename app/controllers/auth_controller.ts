import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, forgotPasswordValidator } from '#validators/auth'
import resetPasswordNotification from '#mails/reset_password_notification'
import { DateTime } from 'luxon'
import PasswordResetToken  from '#models/password-reset'

export default class AuthController {
/**
  *  Login user
  *  @return Object - User object
  */
  public async login({ request, response }: HttpContext) {
    try {
      const { loginId, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(loginId, password)
      const token = await User.accessTokens.create(user)
      return response.ok({
        token: token,
        ...user.serialize(),
      })
    } catch (error) {
      throw error
    }
  }

/**
  *  Get current user
  *  @return Object - User object
  */
  public async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const result = await User.query().where('id', user.id).firstOrFail()
      return response.ok(result)
    } catch (error) {
      throw error
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
      throw error
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
      if (!user) throw new Error('Utilisateur non trouvé.')
      await resetPasswordNotification(user)
      return response.ok({ message: 'Please check your email inbox (and spam) for a password reset link.' })
    } catch (error) {
      throw error
    }
  }

/**
  *  Reset password
  *  @return Object - Success message
  */
  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.body()

    try {
      const passwordReset = await PasswordResetToken.query()
        .where('token', token)
        .where('expires_at', '>', DateTime.now().toSQL())
        .first()

      if (!passwordReset) throw new Error('Token invalide ou expiré.')

      const user = await User.findBy('email', passwordReset.email)
      if (!user) throw new Error('Utilisateur non trouvé.')

      user.password = password
      await user.save()

      await PasswordResetToken.query().where('token', token).delete()
      return response.ok({ message: 'Mot de passe réinitialisé avec succès.' })
    } catch (error) {
      throw error
    }
  }
}
