import { defineConfig } from '@adonisjs/redis'
import { InferConnections } from '@adonisjs/redis/types'
import env from '#start/env'

const redisUrl = env.get('REDIS_URL')
const redisParsedUrl = new URL(redisUrl)

const redisConfig = defineConfig({
  connection: 'main',

  connections: {
    main: {
      host: redisParsedUrl.hostname,
      port: parseInt(redisParsedUrl.port, 10),
      password: redisParsedUrl.password || '',
      retryStrategy(times) {
        return times > 10 ? null : times * 50
      },
    },
  },
})

export default redisConfig

declare module '@adonisjs/redis/types' {
  export interface RedisConnections extends InferConnections<typeof redisConfig> {}
}