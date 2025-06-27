import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import QrToken from '#models/qr_token'
import vine from '@vinejs/vine'

const qrLoginValidator = vine.compile(
  vine.object({
    token: vine.string().startsWith('qr_'),
  })
)

export default class QrAuthController {
  /**
   * Generate QR token for a user (Admin only)
   * POST /admin/users/:id/generate-qr
   */
  public async generateQrToken({ auth, params, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()

      if (currentUser.profil !== 'admin' && currentUser.profil !== 'superadmin') {
        return response.forbidden({
          error: 'Seuls les administrateurs peuvent générer des QR codes',
        })
      }

      const targetUser = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser)
          scopes.id(params.id)
        })
        .firstOrFail()

      await QrToken.revokeUserTokens(targetUser.id)

      const qrToken = await QrToken.create({
        userId: targetUser.id,
        accountId: currentUser.accountId,
        isActive: true,
      })

      return response.ok({
        user: {
          id: targetUser.id,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          profil: targetUser.profil,
        },
        qrData: {
          token: qrToken.token,
          app: 'fork-it',
        },
        createdAt: qrToken.createdAt,
      })
    } catch (error) {
      return response.badRequest({ error: 'Impossible de générer le QR code' })
    }
  }

  /**
   * Authenticate via QR code (Mobile app)
   * POST /auth/qr-login
   */
  public async qrLogin({ request, response }: HttpContext) {
    try {
      const { token } = await request.validateUsing(qrLoginValidator)

      const qrToken = await QrToken.findActiveToken(token)
      if (!qrToken) {
        return response.unauthorized({ error: 'QR code invalide ou expiré' })
      }

      const user = qrToken.user

      const accessToken = await User.accessTokens.create(user, ['*'], {
        name: 'QR Login Token',
        expiresIn: '30 days',
      })

      return response.ok({
        token: accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profil: user.profil,
          accountId: user.accountId,
        },
        qrTokenId: qrToken.id,
      })
    } catch (error) {
      return response.unauthorized({ error: 'Authentification QR échouée' })
    }
  }

  /**
   * Verify token (Mobile app - on each app opening)
   * GET /auth/verify-qr-token
   */
  public async verifyQrToken({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const currentToken = auth.user?.currentAccessToken

      if (!currentToken) {
        return response.unauthorized({ error: 'Token manquant' })
      }

      const qrToken = await QrToken.query()
        .where('user_id', user.id)
        .where('is_active', true)
        .first()

      if (!qrToken) {
        await User.accessTokens.delete(user, currentToken.identifier)
        return response.unauthorized({ error: "Accès révoqué par l'administrateur" })
      }

      return response.ok({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profil: user.profil,
          accountId: user.accountId,
        },
        tokenValid: true,
      })
    } catch (error) {
      return response.unauthorized({ error: 'Token invalide' })
    }
  }

  /**
   * Revoke user's QR token (Admin only)
   * DELETE /admin/users/:id/revoke-qr
   */
  public async revokeQrToken({ auth, params, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()

      if (currentUser.profil !== 'admin' && currentUser.profil !== 'superadmin') {
        return response.forbidden({
          error: 'Seuls les administrateurs peuvent révoquer des QR codes',
        })
      }

      const targetUser = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser)
          scopes.id(params.id)
        })
        .firstOrFail()

      await QrToken.revokeUserTokens(targetUser.id)

      await User.accessTokens.all(targetUser).then((tokens) => {
        tokens.forEach((token) => {
          if (token.name === 'QR Login Token') {
            User.accessTokens.delete(targetUser, token.identifier)
          }
        })
      })

      return response.ok({
        message: 'QR code révoqué avec succès',
        userId: targetUser.id,
      })
    } catch (error) {
      return response.badRequest({ error: 'Impossible de révoquer le QR code' })
    }
  }

  /**
   * List active QR tokens (Admin only)
   * GET /admin/qr-tokens
   */
  public async listActiveTokens({ auth, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()

      if (currentUser.profil !== 'admin' && currentUser.profil !== 'superadmin') {
        return response.forbidden({ error: 'Accès refusé' })
      }

      const tokens = await QrToken.query()
        .where('account_id', currentUser.accountId)
        .where('is_active', true)
        .preload('user')
        .orderBy('created_at', 'desc')

      return response.ok({
        tokens: tokens.map((token) => ({
          id: token.id,
          user: {
            id: token.user.id,
            firstName: token.user.firstName,
            lastName: token.user.lastName,
            profil: token.user.profil,
          },
          createdAt: token.createdAt,
        })),
      })
    } catch (error) {
      return response.badRequest({ error: 'Impossible de récupérer les tokens' })
    }
  }
}