import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { getUpdateValidator, getCreateValidator } from '#validators/auth'
import UserPolicy from '#policies/user_policy'

// Helper function to translate validation messages to French
function translateValidationMessage(field: string, rule: string, originalMessage: string): string {
  const translations: Record<string, Record<string, string>> = {
    firstName: {
      minLength: 'Le prénom doit contenir au moins 3 caractères',
      required: 'Le prénom est obligatoire',
      maxLength: 'Le prénom ne peut pas dépasser 50 caractères'
    },
    lastName: {
      minLength: 'Le nom de famille doit contenir au moins 3 caractères',
      required: 'Le nom de famille est obligatoire',
      maxLength: 'Le nom de famille ne peut pas dépasser 50 caractères'
    },
    email: {
      required: 'L\'adresse email est obligatoire',
      email: 'L\'adresse email n\'est pas valide',
      maxLength: 'L\'adresse email ne peut pas dépasser 100 caractères'
    },
    phone: {
      required: 'Le numéro de téléphone est obligatoire',
      minLength: 'Le numéro de téléphone doit contenir au moins 10 caractères',
      maxLength: 'Le numéro de téléphone ne peut pas dépasser 20 caractères'
    },
    loginId: {
      required: 'L\'identifiant de connexion est obligatoire',
      minLength: 'L\'identifiant doit contenir au moins 3 caractères',
      maxLength: 'L\'identifiant ne peut pas dépasser 30 caractères'
    },
    password: {
      required: 'Le mot de passe est obligatoire',
      minLength: 'Le mot de passe doit contenir au moins 8 caractères',
      maxLength: 'Le mot de passe ne peut pas dépasser 100 caractères'
    },
    profil: {
      required: 'Le profil est obligatoire',
      in: 'Le profil sélectionné n\'est pas valide'
    }
  }
  
  return translations[field]?.[rule] || originalMessage
}

// Helper function to handle various user creation/update errors
function handleUserError(error: any, response: any) {
  // Handle validation errors (VineJS)
  if (error.code === 'E_VALIDATION_ERROR' && error.status === 422) {
    const validationErrors = error.messages || []
    const firstError = validationErrors[0]
    
    if (firstError) {
      const translatedMessage = translateValidationMessage(
        firstError.field,
        firstError.rule,
        firstError.message
      )
      
      return response.status(422).json({
        error: 'Validation Error',
        message: translatedMessage,
        field: firstError.field,
        statusCode: 422,
        details: validationErrors.map((err: any) => ({
          ...err,
          message: translateValidationMessage(err.field, err.rule, err.message)
        }))
      })
    }
    
    return response.status(422).json({
      error: 'Validation Error',
      message: 'Les données fournies ne sont pas valides',
      statusCode: 422,
      details: validationErrors
    })
  }
  
  // Handle PostgreSQL unique constraint violations
  if (error.code === '23505') {
    const constraintName = error.constraint || ''
    let message = 'Cette valeur est déjà utilisée'
    let field = 'unknown'
    
    if (constraintName.includes('phone')) {
      message = 'Ce numéro de téléphone est déjà utilisé'
      field = 'phone'
    } else if (constraintName.includes('email')) {
      message = 'Cette adresse email est déjà utilisée'
      field = 'email'
    } else if (constraintName.includes('login_id')) {
      message = 'Cet identifiant est déjà utilisé'
      field = 'loginId'
    }
    
    return response.status(409).json({
      error: 'Conflict',
      message,
      field,
      statusCode: 409
    })
  }
  
  // Handle "Not Found" errors (ModelNotFoundException)
  if (error.code === 'E_ROW_NOT_FOUND' || error.status === 404) {
    return response.status(404).json({
      error: 'Not Found',
      message: 'Utilisateur non trouvé',
      statusCode: 404
    })
  }
  
  // Handle foreign key constraint violations
  if (error.code === '23503') {
    return response.status(400).json({
      error: 'Bad Request',
      message: 'Référence invalide - certaines données liées n\'existent pas',
      statusCode: 400
    })
  }
  
  // Handle other database errors
  if (error.code && error.code.startsWith('23')) {
    return response.status(400).json({
      error: 'Database Error',
      message: 'Erreur de base de données - données invalides',
      statusCode: 400
    })
  }
  
  // Default: re-throw unknown errors
  throw error
}

export default class UsersController {
/**
  *  Get user by id
  *  Only admin can get other users
  *  @return Object - User object
  */
  public async getOne({ auth, params, response, bouncer }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const user = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser),
          scopes.id(params.id),
          scopes.preload()
        }).firstOrFail()
      if (await bouncer.with(UserPolicy).denies('get', user)) {
        return response.badRequest({ error: 'Cannot get the user' })
      }
      return response.ok(user)
    } catch (error) {
      throw error
    }
  }

/**
  *  Get all users
  *  Only admin can access this route
  *  @return Array - Array of users
  */
  public async getAll({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const { page = 1, perPage = 10, ...filters } = request.qs()
      const users = await User.query()
        .apply((scopes) => {
          scopes.account(currentUser),
          scopes.filters(filters)
        })
        .whereNotIn('profil', ['admin', 'superadmin']) // Exclude admin and superadmin profiles
        .paginate(page, perPage)
      return response.ok(users)
    } catch (error) {
      throw error
    }
  }

/**
  *  Create new user
  *  @return Object - user object
  */
  public async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const validator = getCreateValidator(currentUser.profil)
      let payload = await request.validateUsing(validator)
      const user = await User.create({...payload, accountId: currentUser.accountId})
      return response.ok(user)
    } catch (error) {
      return handleUserError(error, response)
    }
  }

/**
  *  Update user
  *  Only admin can update other users
  *  @return Object - Updated user object
  */
  public  async update({ auth, request, response, params, bouncer }: HttpContext) {
    try {
      const currentUser = auth.getUserOrFail()
      const validator = getUpdateValidator(currentUser.profil)
      const payload = await request.validateUsing(validator)
      const user = await User.findOrFail(params.id)
      if (await bouncer.with(UserPolicy).denies('edit', user)) {
        return response.badRequest({ error: 'Cannot edit the user' })
      }
      await user.merge(payload).save()
      return response.ok(user)
    } catch (error) {
      return handleUserError(error, response)
    }
  }

/**
  *  Delete user
  *  Only admin can delete other users
  *  @return Object - Success message
  */
  public async delete({ params, response, bouncer }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      if (await bouncer.with(UserPolicy).denies('delete', user)) {
        return response.badRequest({ error: 'Cannot deleted the user' })
      }
      await user.delete()
      return response.json({ message: 'User deleted successfully' })
    } catch (error) {
      throw error
    }
  }
}