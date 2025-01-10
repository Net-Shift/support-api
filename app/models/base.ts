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

  public static preload = scope((query, dataToPreload?: string[]) => {
    // if (!query.model.$relationsDefinitions) return
    const relations = [...query.model.$relationsDefinitions.keys()]
    // const relationsToPreload = dataToPreload?.filter(r => relations.includes(r)) ?? relations
    const relationsToPreload = dataToPreload ?? relations
    relationsToPreload.forEach(r => {
      const [relation, nested] = r.split('.')
      if (nested) query.preload(relation as any, (q: any) => { q.preload(nested) })
      else query.preload(relation as any)
    })
  })

  public static filters = scope((query, filters) => {
    query = queryFilters(query, filters)
  })
}