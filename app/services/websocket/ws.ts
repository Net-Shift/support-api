import { Server, Socket } from 'socket.io'
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { HttpContext } from '@adonisjs/core/http'
import { instrument } from "@socket.io/admin-ui" 
import authConfig from '#config/auth'
import User from '#models/user'
import ModelEventEmitter from '#services/websocket/model_events'
import env from '#start/env'

interface ExtendedSocket extends Socket {
  sessionId?: string;
  user?: User;
}

class Ws {
  io: Server | undefined
  private booted = false
  async boot() {
    if (this.booted) {
      return
    }
    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: ["https://admin.socket.io", env.get('APP_URL'), "http://localhost:8081"],
        credentials: true
      }
    })
    instrument(this.io, {
      auth: false
    })

    // Initialiser le ModelEventEmitter avec ce service WebSocket
    ModelEventEmitter.setWebSocketService(this)

    // middleware
    this.io.use(async (socket: ExtendedSocket, next) => {
      const token = socket.handshake.auth.token
      const user =  await this.authenticateUser(token)
      if (!user) return next(new Error("invalid token"))
      socket.user = user as User
      next()
    })

    // connection
    this.io.on('connection', async (socket: ExtendedSocket) => {
      if (!socket.user) return
      const user: User = socket.user
      const accountRoom = `account:${user.accountId}`
      
      socket.join(accountRoom)
    
      socket.on('disconnect', () => {
        socket.leave(accountRoom)
      })
    })
  }

  private async authenticateUser(token: string) {
    try {
      const authResolver = await authConfig.resolver(app)
      const request: Request = {
        header: () => `Bearer ${token}`,
      } as unknown as Request

      let ctx: HttpContext = {
        request: request,
      } as unknown as HttpContext

      const auth = authResolver.guards.api(ctx)
      const user = await auth.authenticate()
      return user

    } catch (error) {
      return error
    }
  }

  public emitModelEvent(accountId: string, event: string, data: any) {
    console.log('Emitting model event:', event, 'to account:', accountId, 'with data:', data)
    this.io?.to(`account:${accountId}`).emit(event, data);
  }
}

export default new Ws()