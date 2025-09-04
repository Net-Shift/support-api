import vine from '@vinejs/vine'


const baseTicketSchema = vine.object({
  title: vine.string().optional(),
  description: vine.string().optional(),
})

const baseReplyTicketSchema = vine.object({
  title: vine.string().optional(),
  description: vine.string().optional(),
  parentTicketMessageId: vine
    .string()
    .exists(async (query, field) => {
      const ticketMessage = await query.from('ticket_messages').where('id', field).first()
      return !!ticketMessage
    }),
})

export const createTicket = vine.compile(baseTicketSchema)

export const createReplyTicket = vine.compile(baseReplyTicketSchema)

export const updateTicket = vine.compile(
  vine.object({
    title: vine.string().optional(),
    description: vine.string().optional()
  })
)
