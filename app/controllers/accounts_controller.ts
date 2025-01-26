import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import { createAccount, updateAccount } from '#validators/account'

export default class AccountsController {
/**
  *  Get account by id
  *  Only superadmin can get other account
  *  @return Object - Account object
  */
  public async getOne({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const account = await Account.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      return response.ok(account)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Get all accounts
  *  Only superadmin can get other accounts
  *  @return Array - Array of accounts
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const accounts = await Account.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.filters(filters)
        })
        .paginate(page, perPage)
      return response.ok(accounts)
    } catch (error) {
      return response.badRequest({ error: error })
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
      return response.badRequest({ error: error })
    }
  }

/**
  *  Update account
  *  Only superadmin or same admin can update other accounts
  *  @return Object - Updated account object
  */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const account = await Account.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      const payload = await request.validateUsing(updateAccount)
      account.merge(payload)
      await account.save()
      return response.ok(account)
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }

/**
  *  Delete account
  *  Only superadmin can delete other accounts
  *  @return Object - Success message
  */
  public async delete({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const account = await Account.query()
        .apply((scopes) => {
          scopes.account(user),
          scopes.id(params.id)
        })
        .firstOrFail()
      await account.delete()
      return response.json({ message: 'account deleted successfully' })
    } catch (error) {
      return response.badRequest({ error: error })
    }
  }
}