import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { createRoom, updateRoom } from '#validators/room'

export default class RoomsController {
/**
  *  Get room by id
  *  @return Object - Room object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const room = await Room.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(room)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all rooms
  *  @return Array - Array of rooms
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const rooms = await Room.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(rooms)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new room
  *  @return Object - Room object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createRoom)
      const user = auth.getUserOrFail()
      const room = await Room.create({ ...payload, accountId: user!.accountId})
      return response.ok(room)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update room 
  *  @return Object - Updated room object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const room = await Room.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateRoom)
      room.merge(payload)
      await room.save()
      return response.ok(room)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete room 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const room = await Room.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await room.delete()
      return response.json({ message: 'room deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}