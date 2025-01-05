import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    loginId: vine.string(),
    password: vine.string().minLength(8).maxLength(32),
  })
)


export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email()
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8).maxLength(32)
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
    password: vine.string().minLength(8).maxLength(32),
    loginId: vine
      .string()
      .minLength(8)
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
      const user = await query.from('users').where('email', field).whereNot('id', value.parent.id).first()
      return !user
    }).optional(),
  password: vine.string().minLength(8).maxLength(32).optional(),
  profil: vine.enum(['superadmin', 'admin', 'manager', 'server', 'chef']),
  loginId: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .unique(async (query, field, value) => {
      const user = await query.from('users').where('login_id', field).whereNot('id', value.parent.id).first()
      return !user
    }),
  phone: vine.string().optional()
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

export function getUpdateValidator(profil: string) {
  return (profil === 'superadmin' || profil === 'admin') ? updateUserAdmin : updateUser
}

