import { defineConfig } from '@adonisjs/transmit'
import { redis } from '@adonisjs/transmit/transports'

export default defineConfig({
  pingInterval: false,
  transport: {
    driver: redis({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      keyPrefix: 'transmit',
    })
  }
})