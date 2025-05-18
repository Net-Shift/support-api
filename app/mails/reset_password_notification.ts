import User from '#models/user'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import PasswordResetToken  from '#models/password-reset'

export default async function sendResetPasswordNotification(user: User) {
  try {
    const token = randomBytes(32).toString('hex')
    await PasswordResetToken.create({
      email: user.email,
      token,
      expiresAt: DateTime.now().plus({ hours: 1 }),
      used: false
    })
    const resetUrl = `${env.get('PASSWORD_RESET_PAGE_URL')}?token=${token}`

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Réinitialisation de mot de passe')
        .html(`
          <h1>Réinitialisation de mot de passe</h1>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
          <p>Ce lien expirera dans 1 heure.</p>
        `)
    })
  } catch (error) {
    console.log('error', error)
  }
}
