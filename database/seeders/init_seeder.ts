import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Account from '#models/account'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const account = await Account.create(
      { name: 'super admin'}
    )
    await User.create(
      {
        accountId: account.id,
        email: 'super@admin.fr',
        password: 'azertY31.',
        firstName: 'super',
        lastName: 'admin',
        profil: 'superadmin',
        loginId: 'superadmin'
      }
    )
  }
}