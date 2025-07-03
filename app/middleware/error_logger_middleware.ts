import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class ErrorLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await next()
      
      // Log 4xx and 5xx responses
      const { response, request } = ctx
      const status = response.getStatus()
      
      if (status >= 400) {
        const responseBody = response.getBody()
        const logData = {
          method: request.method(),
          url: request.url(),
          status,
          message: responseBody?.message || responseBody?.error || responseBody,
          ip: request.ip(),
          userAgent: request.header('user-agent'),
          timestamp: new Date().toISOString()
        }
        
        if (status >= 500) {
          logger.error(logData, `${status} Server Error`)
        } else {
          logger.warn(logData, `${status} Client Error`)
        }
      }
    } catch (error) {
      // Log uncaught errors
      const { request } = ctx
      logger.error('Uncaught error in request', {
        method: request.method(),
        url: request.url(),
        error: error.message,
        stack: error.stack,
        ip: request.ip(),
        userAgent: request.header('user-agent'),
        timestamp: new Date().toISOString()
      })
      
      // Re-throw the error to let the exception handler deal with it
      throw error
    }
  }
}