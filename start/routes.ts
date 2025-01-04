import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// bouncer
import { isAdmin, isSuperAdmin } from '#abilities/main'

const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/users_controller')
const RoomController = () => import('#controllers/rooms_controller')
const TableController = () => import('#controllers/tables_controller')
const OrderController = () => import('#controllers/orders_controller')
const OrderItemController = () => import('#controllers/order_items_controller')
const ItemController = () => import('#controllers/items_controller')
const StatusController = () => import('#controllers/statuses_controller')
const ItemTypeController = () => import('#controllers/item_types_controller')
const AccountController = () => import('#controllers/accounts_controller')


router.group(() => {

/**
  * Auth routes
  */
  router.group(() => {
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
    router.get('', [UserController, 'getAll']).use(middleware.bouncer(isAdmin))
    router.post('', [UserController, 'create']).use(middleware.bouncer(isAdmin))
    router.put('/:id', [UserController, 'update'])
    router.delete('/:id', [UserController, 'delete']).use(middleware.bouncer(isAdmin))
  }).prefix('user').use(middleware.auth())

/**
  * Room routes
  * 
  */
  router.group(() => {
    router.get('/:id', [RoomController, 'getOne'])
    router.get('', [RoomController, 'getAll'])
    router.post('create', [RoomController, 'create']).use(middleware.bouncer(isAdmin))
    router.put('update/:id', [RoomController, 'update']).use(middleware.bouncer(isAdmin))
    router.delete('delete/:id', [RoomController, 'delete']).use(middleware.bouncer(isAdmin))
  }).prefix('room').use(middleware.auth())

/**
  * Table routes
  * 
  */
  router.group(() => {
    router.get('/:id', [TableController, 'getOne'])
    router.get('', [TableController, 'getAll'])
    router.post('create', [TableController, 'create']).use(middleware.bouncer(isAdmin))
    router.put('update/:id', [TableController, 'update'])
    router.delete('delete/:id', [TableController, 'delete']).use(middleware.bouncer(isAdmin))
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
    router.delete('delete/:id', [OrderController, 'delete']).use(middleware.bouncer(isAdmin))
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
  * Item routes
  * 
  */
  router.group(() => {
    router.get('/:id', [ItemController, 'getOne'])
    router.get('', [ItemController, 'getAll'])
    router.post('', [ItemController, 'create'])
    router.put('/:id', [ItemController, 'update']).use(middleware.bouncer(isAdmin))
    router.delete('/:id', [ItemController, 'delete']).use(middleware.bouncer(isAdmin))
  }).prefix('item').use(middleware.auth())

/**
  * Status routes
  * 
  */
  router.group(() => {
    router.get('/:id', [StatusController, 'getOne'])
    router.get('', [StatusController, 'getAll'])
    router.post('create', [StatusController, 'create'])
    router.put('update/:id', [StatusController, 'update'])
    router.delete('delete/:id', [StatusController, 'delete'])
  }).prefix('status').use([middleware.auth(), middleware.bouncer(isAdmin)])

/**
  * ItemType routes
  * 
  */
  router.group(() => {
    router.get('/:id', [ItemTypeController, 'getOne'])
    router.get('', [ItemTypeController, 'getAll'])
    router.post('create', [ItemTypeController, 'create'])
    router.put('update/:id', [ItemTypeController, 'update'])
    router.delete('delete/:id', [ItemTypeController, 'delete'])
  }).prefix('itemType').use([middleware.auth(), middleware.bouncer(isAdmin)])

/**
  * Account routes
  * 
  */
  router.group(() => {
    router.get('/:id', [AccountController, 'getOne'])
    router.get('', [AccountController, 'getAll'])
    router.post('create', [AccountController, 'create'])
    router.put('update/:id', [AccountController, 'update'])
    router.delete('delete/:id', [AccountController, 'delete'])
  }).prefix('account').use([middleware.auth(), middleware.bouncer(isSuperAdmin)])

}).prefix('api')
