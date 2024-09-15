import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { createRoom } from '#validators/room'

export default class AccountsController {
/**
  *  Get room by id
  *  @return Object - Room object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      return response.ok(room)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Get all rooms
  *  @return Array - Array of rooms
  */
  public async getAll({ response }: HttpContext) {
    try {
      const rooms = await Room.query()
      return response.ok(rooms)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Create new room
  *  @return Object - Room object
  */
  public async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createRoom)
      const room = await Room.create({ ...payload})
      return response.ok(room)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Update room 
  *  @return Object - Updated room object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      const payload = await request.validateUsing(createRoom)
      room.merge(payload)
      await room.save()
      return response.ok(room)
    } catch (error) {
      return response.badRequest({ error: error.message })
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
      return response.badRequest({ error: error.message })
    }
  }
}