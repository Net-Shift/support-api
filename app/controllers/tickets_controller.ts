import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket_message'
import { createTicket, updateTicket, createReplyTicket } from '#validators/ticket'
import TicketPolicy from '#policies/ticket_policy'

export default class ItemsController {
/**
  *  Get ticket by id
  *  @return Object - Ticket object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const ticket = await Ticket.query()
        .apply((scopes) => {
          scopes.byAccount(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      return response.ok(ticket)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all tickets
  *  @return Array - Array of tickets
  */

  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 100, ...filters } = request.qs()
      const tickets = await Ticket.query()
        .apply((scopes) => {
          scopes.byAccount(user),
          scopes.filters(filters),
          scopes.preload()
        })
        .paginate(page, perPage)
      return response.ok(tickets)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new ticket
  *  @return Object - Ticket object
  */
  public async create({ auth, request, response }: HttpContext) {
    console.log('=> Creating ticket...')
    try {
      const payload = await request.validateUsing(createTicket)
      const user = auth.getUserOrFail()
      const ticket = await Ticket.create({
        ...payload,
        isInitial: true,
        accountId: user!.accountId,
        userId: user!.id,
      })
      await ticket.refresh()
      return response.ok(ticket)
    } catch (error) {
      throw error
    }
  }

/**
  *  Update ticket 
  *  @return Object - Updated ticket object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await user.load('account')
      const ticket = await Ticket.query()
        .apply((scopes) => {
          scopes.byAccount(user),
          scopes.id(params.id),
          scopes.preload()
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateTicket)
      await ticket.merge(payload).save() 
      return response.ok(ticket)
    } catch (error) {
      throw error
    }
  }

/**
  *  Delete ticket 
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      await user.load('account')
      const ticket = await Ticket.query()
        .apply((scopes) => {
          scopes.byAccount(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await ticket.delete()
      return response.json({ message: 'ticket deleted successfully' })
    } catch (error) {
      throw error
    }
  }

/**
  *  Reply to a ticket 
  *  @return Object - Ticket object
  */
  public async reply({ auth, params, request, response, bouncer }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const ticketId = params.id
      const parentTicketMessage = await Ticket.query().where('id', ticketId).firstOrFail()
      request.updateBody({ ...request.body(), parentTicketMessageId: ticketId })
      if (await bouncer.with(TicketPolicy).denies('canReply', parentTicketMessage)) {
        return response.badRequest({ error: 'Cannot reply to the ticket' })
      }
      const payload = await request.validateUsing(createReplyTicket)
      const ticket = await Ticket.create({ 
        ...payload,
        accountId: user!.accountId,
        userId: user!.id,
        // type: user.accountType === 'customer' ? 'customerReply' : 'agentReply'
      })
      return response.ok(ticket)
    } catch (error) {
      throw error
    }
  }
}

