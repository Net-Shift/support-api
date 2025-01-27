import { defineConfig } from '@adonisjs/transmit'
import { redis } from '@adonisjs/transmit/transports'
import env from '#start/env'

const redisUrl = env.get('REDIS_URL')
const redisParsedUrl = new URL(redisUrl)

export default defineConfig({
  pingInterval: false,
  transport: {
    driver: redis({
      host: redisParsedUrl.hostname,
      port: parseInt(redisParsedUrl.port, 10),
      password: redisParsedUrl.password || '',
      keyPrefix: 'transmit',
    })
  }
})