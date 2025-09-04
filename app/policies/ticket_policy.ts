import User from '#models/user'
import Ticket from '#models/ticket_message'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class TicketPolicy extends BasePolicy {

  canReply(user: User, parentTicketMessage: Ticket): AuthorizerResponse {
    console.log('=> Checking if user can reply to ticket', user, parentTicketMessage)
    if (user && user.accountType !== 'customer') {
      return user.accountId === parentTicketMessage.accountId
    } else if (user && user.accountType === 'agent') {
      const customerAccountIds = user.account.accountCustomersIds.map((account: { id: string }) => account.id);
      if (!customerAccountIds.includes(parentTicketMessage.accountId)) {
        return true
      } else {
        return false
      }
    }
    return false
  }
}