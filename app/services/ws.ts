import { Server, Socket } from 'socket.io'
import app from '@adonisjs/core/services/app'
import redis from '@adonisjs/redis/services/main'
import server from '@adonisjs/core/services/server'
import { HttpContext } from '@adonisjs/core/http'
import { instrument } from "@socket.io/admin-ui" 
import { cuid } from '@adonisjs/core/helpers'
import authConfig from '#config/auth'

interface ExtendedSocket extends Socket {
  sessionId?: string;
  userId?: string;
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
        origin: ["https://admin.socket.io", "http://localhost:8080"],
        credentials: true
      }
    })
    instrument(this.io, {
      auth: false
    })

    // middleware
    this.io.use(async (socket: ExtendedSocket, next) => {
      console.log('middleware =>')
      const token = socket.handshake.auth.token
      const user =  await this.authenticateUser(token)
      if (!user) {
        return next(new Error("invalid token"))
      }
      next()
    })

    // connection
    this.io.on('connection', async (socket: ExtendedSocket) => {
      console.log('connection =>')
      const token = socket.handshake.auth.token
      const user =  await this.authenticateUser(token)
      const sessionId = socket.handshake.auth.sessionId
      if (sessionId) {
        const savedSocketId = await redis.get(`user:socketId:${user?.id}`)
        if (savedSocketId) {
          socket.sessionId = savedSocketId
          socket.userId = user?.id
        }
      }
      socket.sessionId = cuid()
      socket.userId = user?.id
      await redis.set(`user:socketId:${socket.userId}`, socket.sessionId)
  
      socket.emit('session', { sessionId: socket.sessionId})
      // socket.join(`channel:notifTypeOne:accountId:${user?.accountId}`)
      // socket.join(`channel:notifTypeTwo:accountId:${user?.accountId}`)
      socket.on('disconnect', () => {
        console.log('disconnect')
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
      console.log(error)
      // socket.disconnect()
    }
  }
}


export default new Ws()