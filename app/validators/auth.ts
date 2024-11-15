import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    loginId: vine.string(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const registerValidator = vine.compile(
  vine.object({
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
    })
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
    .unique(async (query, field) => {
      const user = await query.from('users').where('email', field).first()
      return !user
    }).optional(),
  password: vine.string().minLength(8).maxLength(32).optional()
})

export const updateUser = vine.compile(
  vine.object({
    ...baseUserSchema.getProperties()
  })
)

export const updateUserAdmin = vine.compile(
  vine.object({
    ...baseUserSchema.getProperties(),
    profil: vine.string().notSameAs('superadmin').optional(),
    loginId: vine.string().optional()
  })
)

export function getUserValidator(profil: string) {
  return (profil === 'superadmin' || profil === 'admin') ? updateUserAdmin : updateUser
}

