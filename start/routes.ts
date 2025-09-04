import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
// bouncer
import { isAdmin, isSuperAdmin } from '#abilities/main'

const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/users_controller')
const TicketController = () => import('#controllers/tickets_controller')
const AccountController = () => import('#controllers/accounts_controller')
const QrAuthController = () => import('#controllers/qr_auth_controller')
const TagController = () => import('#controllers/tags_controller')

router
  .group(() => {
    /**
     * Auth routes
     */
    router
      .group(() => {
        router.post('login', [AuthController, 'login'])
        router.post('/qr-login', [QrAuthController, 'qrLogin'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
        router.get('/me', [AuthController, 'me']).use(middleware.auth())
        router.get('/verify-qr-token', [QrAuthController, 'verifyQrToken']).use(middleware.auth())
        router.post('/forgot-password', [AuthController, 'forgotPassword'])
        router.post('/reset-password', [AuthController, 'resetPassword'])
        // router
        //   .post('reset-password/:id/:token', [AuthController, 'resetPassword'])
        //   .as('resetPassword')
      })
      .prefix('auth')

    /**
     * User routes
     *
     */
    router
      .group(() => {
        router.get('/:id', [UserController, 'getOne'])
        router.get('', [UserController, 'getAll']).use(middleware.bouncer(isAdmin))
        router.post('', [UserController, 'create']).use(middleware.bouncer(isAdmin))
        router.put('/:id', [UserController, 'update'])
        router.delete('/:id', [UserController, 'delete']).use(middleware.bouncer(isAdmin))
      })
      .prefix('user')
      .use(middleware.auth())

    /**
     * Ticket routes
     *
     */
    router
      .group(() => {
        router.get('/:id', [TicketController, 'getOne'])
        router.get('', [TicketController, 'getAll'])
        router.post('', [TicketController, 'create'])
        router.put('/:id', [TicketController, 'update']).use(middleware.bouncer(isAdmin))
        router.delete('/:id', [TicketController, 'delete']).use(middleware.bouncer(isAdmin))
        router.post('/:id/reply', [TicketController, 'reply'])
      })
      .prefix('ticket')
      .use(middleware.auth())

    /**
     * QR Token routes (Admin only)
     */
    router
      .group(() => {
        router.get('/user/:id/qr-token', [QrAuthController, 'getOrGenerateQrToken'])
        router.post('/user/:id/generate-qr', [QrAuthController, 'generateQrToken'])
        router.get('/qr-tokens', [QrAuthController, 'listActiveTokens'])
      })
      .prefix('admin')
      .use([middleware.auth(), middleware.bouncer(isAdmin)])

    /**
     * Tag routes
     *
     */
    router
      .group(() => {
        router.get('/:id', [TagController, 'getOne'])
        router.get('', [TagController, 'getAll'])
        router.post('', [TagController, 'create'])
        router.put('/:id', [TagController, 'update'])
        router.delete('/:id', [TagController, 'delete'])
      })
      .prefix('tag')
      .use(middleware.auth())

    /**
     * Account routes
     *
     */
    router
      .group(() => {
        router.get('/:id', [AccountController, 'getOne'])
        router.get('', [AccountController, 'getAll'])
        router.post('', [AccountController, 'create'])
        router.put('/:id', [AccountController, 'update'])
        router.delete('/:id', [AccountController, 'delete'])
      })
      .prefix('account')
      .use([middleware.auth(), middleware.bouncer(isSuperAdmin)])
  })
  .prefix('api')
