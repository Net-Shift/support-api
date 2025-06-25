import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    loginId: vine.string(),
    password: vine.string().minLength(3).maxLength(32),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(3).maxLength(32)
  })
)

export const registerValidator = vine.object({
    firstName: vine.string().minLength(3).maxLength(64),
    lastName: vine.string().minLength(3).maxLength(64),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }).optional(),
    password: vine.string().minLength(3).maxLength(32),
    loginId: vine
      .string()
      .minLength(3)
      .maxLength(32)
      .unique(async (query, field) => {
        const user = await query.from('users').where('login_id', field).first()
        return !user
      }),
    profil: vine.enum(['superadmin', 'admin', 'manager', 'server', 'chef']),
    phone: vine.string().optional()
})

export const createUser = vine.compile(
  vine.object({
    ...registerValidator.getProperties()
  })
)

export const createUserAdmin = vine.compile(
  vine.object({
    ...registerValidator.getProperties(),
    accountId: vine.string().optional()
  })
)

export function getCreateValidator(profil: string) {
  return profil === 'superadmin' ? createUserAdmin : (createUser as typeof createUserAdmin)
}

const baseUserSchema = vine.object({
  address: vine.object({
    street: vine.string(),
    city: vine.string(),
    zipcode: vine.string(),
  }).optional(),
  firstName: vine.string().minLength(3).maxLength(64).optional(),
  lastName: vine.string().minLength(3).maxLength(64).optional(),
  email: vine
    .string()
    .email()
    .unique(async (query, field, value) => {
      // Récupérer l'ID depuis les paramètres de la requête ou depuis le parent
      const userId = value.meta?.params?.id || value.parent?.id;
      
      let queryBuilder = query.from('users').where('email', field);
      
      // Seulement ajouter whereNot si on a un ID (cas d'update)
      if (userId) {
        queryBuilder = queryBuilder.whereNot('id', userId);
      }
      
      const user = await queryBuilder.first();
      return !user;
    }).optional(),
  password: vine.string().minLength(3).maxLength(32).optional(),
  profil: vine.enum(['superadmin', 'admin', 'manager', 'server', 'chef']).optional(),
  loginId: vine
    .string()
    .minLength(3)
    .maxLength(32)
    .unique(async (query, field, value) => {
      // Récupérer l'ID depuis les paramètres de la requête ou depuis le parent
      const userId = value.meta?.params?.id || value.parent?.id;
      
      let queryBuilder = query.from('users').where('login_id', field);
      
      // Seulement ajouter whereNot si on a un ID (cas d'update)
      if (userId) {
        queryBuilder = queryBuilder.whereNot('id', userId);
      }
      
      const user = await queryBuilder.first();
      return !user;
    }).optional(),
  phone: vine.string().optional(),
  // Ajouter le champ profileImage pour l'update d'image
  profileImage: vine.string().optional()
})

export const updateUser = vine.compile(
  vine.object({
    ...baseUserSchema.getProperties()
  })
)

export const updateUserAdmin = vine.compile(
  vine.object({
    ...baseUserSchema.getProperties(),
  })
)

// Validateur spécifique pour l'update d'image de profil (plus permissif)
export const updateProfileImageValidator = vine.compile(
  vine.object({
    profileImage: vine.string().optional(),
    // Champs obligatoires mais sans validation unique pour éviter les conflits
    profil: vine.enum(['superadmin', 'admin', 'manager', 'server', 'chef']).optional(),
    loginId: vine.string().optional(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    email: vine.string().email().optional(),
    phone: vine.string().optional(),
    accountId: vine.string().optional()
  })
)

export function getUpdateValidator(profil: string) {
  return (profil === 'superadmin' || profil === 'admin') ? updateUserAdmin : updateUser
}