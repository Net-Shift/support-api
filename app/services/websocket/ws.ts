import { Server, Socket } from 'socket.io'
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { HttpContext } from '@adonisjs/core/http'
import { instrument } from "@socket.io/admin-ui" 
import authConfig from '#config/auth'
import User from '#models/user'
import { EventType, SocketEvents } from './ws.type.js'

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
        origin: ["https://admin.socket.io", "http://localhost:8081"],
        credentials: true
      }
    })
    instrument(this.io, {
      auth: false
    })

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
      
      Object.values(EventType).forEach(eventType => {
        socket.on(eventType, (data: SocketEvents[typeof eventType]) => {
          console.log('Received event:', eventType, 'with data:', data)
          socket.to(accountRoom).emit(eventType, data)
        })
      })
    
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

  public emit<T extends EventType>(
    accountId: string, 
    event: T,
    data: SocketEvents[T]
  ) {
    console.log('Emitting event:', event, 'to account:', accountId, 'with data:', data)
    this.io?.to(`account:${accountId}`).emit(event, data);
  }
}

export default new Ws()