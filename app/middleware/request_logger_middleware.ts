import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const startTime = Date.now()
    const { request } = ctx

    logger.info(`[${new Date().toISOString()}] ${request.method()} ${request.url()} - START`)

    await next()

    const duration = Date.now() - startTime
    const { response } = ctx

    logger.info(`${request.method()} ${request.url()} - ${response.getStatus()} - ${duration}ms`)
  }
}