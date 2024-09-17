import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { createRoom, updateRoom } from '#validators/room'

export default class RoomsController {
/**
  *  Get room by id
  *  @return Object - Room object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      return response.ok(room)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all rooms
  *  @return Array - Array of rooms
  */
  public async getAll({ response }: HttpContext) {
    try {
      const rooms = await Room.query().preload('tables')
      return response.ok(rooms)
    } catch (error) {
      console.log('error >>', error)
      return response.badRequest({ error: error })
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
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update room 
  *  @return Object - Updated room object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      const payload = await request.validateUsing(updateRoom)
      room.merge(payload)
      await room.save()
      return response.ok(room)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete room 
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      await room.delete()
      return response.json({ message: 'room deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}