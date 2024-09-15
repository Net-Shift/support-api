import User from '#models/user'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'

export default async function sendResetPasswordNotification(user: User) {
  try {
    const signedURL = router
      .builder()
      .prefixUrl(env.get('API_URL'))
      .params({ id: user.id, token: encodeURIComponent(user.password) })
      .makeSigned('resetPassword', { expiresIn: '30 minutes' })

    const url = `${env.get('PASSWORD_RESET_PAGE_URL')}?token=${encodeURIComponent(signedURL)}`
    // console.log('url =>', url)
    await mail.send((message) => {
      message
        .to(('guillaumeleger140@gmail.com')) // user.email
        .from('guillaumeleger430@gmail.com')
        .subject('Reset your password')
        .html(`Click <a href="${url}">here</a> to reset your password.`)
    })
  } catch (error) {
    console.log('error', error)
  }
}
