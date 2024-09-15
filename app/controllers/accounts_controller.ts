import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import { createAccount } from '#validators/account'

export default class AccountsController {
/**
  *  Get account by id
  *  Only superadmin can get other account
  *  @return Object - Account object
  */
  public async getOne({ params, response }: HttpContext) {
    try {
      const account = await Account.findOrFail(params.id)
      return response.ok(account)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Get all accounts
  *  Only superadmin can get other accounts
  *  @return Array - Array of accounts
  */
  public async getAll({ response }: HttpContext) {
    try {
      const accounts = await Account.query().preload('users').preload('rooms')
      return response.ok(accounts)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Create new account
  *  Only superadmin can create account
  *  @return Object - Account object
  */
  public async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createAccount)
      const account = await Account.create({ ...payload})
      return response.ok(account)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Update account
  *  Only superadmin or same admin can update other accounts
  *  @return Object - Updated account object
  */
  public async update({ params, request, response }: HttpContext) {
    try {
      const account = await Account.findOrFail(params.id)
      const payload = await request.validateUsing(createAccount)
      account.merge(payload)
      await account.save()
      return response.ok(account)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

/**
  *  Delete account
  *  Only superadmin can delete other accounts
  *  @return Object - Success message
  */
  public async delete({ params, response }: HttpContext) {
    try {
      const account = await Account.findOrFail(params.id)
      await account.delete()
      return response.json({ message: 'account deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}