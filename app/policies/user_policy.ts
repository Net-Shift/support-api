import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

const SUPERADMIN = 'superadmin'
const ADMIN = 'admin'

export default class UserPolicy extends BasePolicy {
  
    get(currentUser: User, user: User): AuthorizerResponse {
      const allowUserRole = [ADMIN, SUPERADMIN]
      if (allowUserRole.includes(currentUser.profil)) {
        return true
      }
      return currentUser.id === user.id
    }

    edit(currentUser: User, user: User): AuthorizerResponse {
      const allowUserRole = [ADMIN, SUPERADMIN]
      if (allowUserRole.includes(currentUser.profil)) {
        return true
      }
      return currentUser.id === user.id
    }

    delete(currentUser: User, user: User): AuthorizerResponse {
      const allowUserRole = [ADMIN, SUPERADMIN]
      if (allowUserRole.includes(currentUser.profil)) {
        return true
      }
      return currentUser.id === user.id
    }
  
}