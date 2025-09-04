import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Account from '#models/account'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const account_1 = await Account.create(
      { 
        name: 'super admin agent',
        accountType: 'agent',
        accountReferenceId: null
      }
    )
    await User.createMany([
      {
        accountId: account_1.id,
        email: 'superadmin@agent.fr',
        accountType: 'agent',
        password: 'azerty',
        firstName: 'superadmin',
        lastName: 'superadmin',
        profil: 'superadmin',
        loginId: 'superadmin'
      },
      {
        accountId: account_1.id,
        email: 'admin@agent.fr',
        accountType: 'agent',
        password: 'azerty',
        firstName: 'admin',
        lastName: 'admin',
        profil: 'admin',
        loginId: 'admin_agent'
      }
    ])

    const account_2 = await Account.create(
      { 
        name: 'admin customer',
        accountType: 'customer',
        accountReferenceId: account_1.id
      }
    )
    await User.createMany([
      {
        accountId: account_2.id,
        email: 'admin@customer.fr',
        accountType: 'customer',
        password: 'azerty',
        firstName: 'admin',
        lastName: 'admin',
        profil: 'admin',
        loginId: 'admin_customer'
      },
      {
        accountId: account_2.id,
        email: 'manager@customer.fr',
        accountType: 'customer',
        password: 'azerty',
        firstName: 'manager',
        lastName: 'manager',
        profil: 'manager',
        loginId: 'manager_customer'
      }
    ])
  }
}