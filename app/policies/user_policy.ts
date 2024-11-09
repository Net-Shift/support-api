import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

const SUPERADMIN = 'superadmin'
const ADMIN = 'admin'

export default class UserPolicy extends BasePolicy {
  
    edit(currentUser: User, user: User): AuthorizerResponse {
      const allowUserRole = [ADMIN, SUPERADMIN]
      if (allowUserRole.includes(user.profil)) {
        return true
      }
      return currentUser.id === user.accountId
    }
  

    delete(currentUser: User, user: User): AuthorizerResponse {
      const allowUserRole = [ADMIN, SUPERADMIN]
      if (allowUserRole.includes(user.profil)) {
        return true
      }
      return currentUser.id === user.accountId
    }
  
}