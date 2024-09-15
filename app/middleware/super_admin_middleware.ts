import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class MainAccountMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth?.user?.profil === 'superadmin') {
      await next()
    } else {
      return ctx.response.unauthorized({ error: 'Only Superadmin can perform this action' })
    }
  }
}