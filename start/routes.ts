import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/users_controller')
const RoomController = () => import('#controllers/rooms_controller')
const TableController = () => import('#controllers/tables_controller')
const OrderController = () => import('#controllers/orders_controller')
const OrderItemController = () => import('#controllers/order_items_controller')
const AccountController = () => import('#controllers/accounts_controller')


router.group(() => {

/**
  * Auth routes
  */
  router.group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('me', [AuthController, 'me']).use(middleware.auth())
    router.post('forgot-password', [AuthController, 'forgotPassword'])
    router.post('reset-password/:id/:token', [AuthController, 'resetPassword']).as('resetPassword')
  }).prefix('auth')

/**
  * User routes
  *  
  */
  router.group(() => {
    router.get('/:id', [UserController, 'getOne'])
    router.get('', [UserController, 'getAll']).use(middleware.isAdmin())
    router.put('update/:id', [UserController, 'update'])
    router.delete('delete/:id', [UserController, 'delete']).use(middleware.isAdmin())
  }).prefix('user').use(middleware.auth())

/**
  * Room routes
  * 
  */
  router.group(() => {
    router.get('/:id', [RoomController, 'getOne'])
    router.get('', [RoomController, 'getAll'])
    router.post('create', [RoomController, 'create']).use(middleware.isAdmin())
    router.put('update/:id', [RoomController, 'update']).use(middleware.isAdmin())
    router.delete('delete/:id', [RoomController, 'delete']).use(middleware.isAdmin())
  }).prefix('room').use(middleware.auth())

/**
  * Table routes
  * 
  */
  router.group(() => {
    router.get('/:id', [TableController, 'getOne'])
    router.get('', [TableController, 'getAll'])
    router.post('create', [TableController, 'create']).use(middleware.isAdmin())
    router.put('update/:id', [TableController, 'update'])
    router.delete('delete/:id', [TableController, 'delete']).use(middleware.isAdmin())
  }).prefix('table').use(middleware.auth())

/**
  * Order routes
  * 
  */
  router.group(() => {
    router.get('/:id', [OrderController, 'getOne'])
    router.get('', [OrderController, 'getAll'])
    router.post('create', [OrderController, 'create'])
    router.put('update/:id', [OrderController, 'update'])
    router.delete('delete/:id', [OrderController, 'delete'])
  }).prefix('order').use(middleware.auth())

/**
  * OrderItem routes
  * 
  */
  router.group(() => {
    router.get('/:id', [OrderItemController, 'getOne'])
    router.get('', [OrderItemController, 'getAll'])
    router.post('create', [OrderItemController, 'create'])
    router.put('update/:id', [OrderItemController, 'update'])
    router.delete('delete/:id', [OrderItemController, 'delete'])
  }).prefix('orderItem').use(middleware.auth())


/**
  * Account routes
  * 
  */
  router.group(() => {
    router.get('/:id', [AccountController, 'getOne']).use(middleware.isSuperAdmin())
    router.get('', [AccountController, 'getAll']).use(middleware.isSuperAdmin())
    router.post('create', [AccountController, 'create']).use(middleware.isSuperAdmin())
    router.put('update/:id', [AccountController, 'update']).use(middleware.isAdmin())
    router.delete('delete/:id', [AccountController, 'delete']).use(middleware.isSuperAdmin())
  }).prefix('account').use(middleware.auth())

}).prefix('api')
