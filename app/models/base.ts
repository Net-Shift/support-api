import { BaseModel as AdonisBaseModel, scope } from '@adonisjs/lucid/orm'
import { queryFilters } from '#utils/filter'

export default class BaseModel extends AdonisBaseModel {

  public static id = scope((query, id) => {
    query.where('id', id)
  })

  public static account = scope((query, user) => {
    if (user && user.profil !== 'superadmin') {
      query.where('accountId', user.accountId)
    }
  })

  public static preload = scope((query) => {
    const model = query.model
    if (!model.$relationsDefinitions) return
    const relations = Array.from(model.$relationsDefinitions.keys())
    relations.forEach(relation =>
      query.preload(relation as any)
    )
  })

  public static filters = scope((query, filters) => {
    query = queryFilters(query, filters)
  })
}