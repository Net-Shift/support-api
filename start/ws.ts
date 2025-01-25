import app from '@adonisjs/core/services/app'
import Ws from '#services/websocket/ws'

app.ready(() => {
  Ws.boot()
})