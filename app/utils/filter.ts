import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

type ComparaisonOperator = '>' | '>=' | '<' | '<=' | '=' | '!=' | 'like' | 'not like'

interface ComparaisonFilter {
  operator: ComparaisonOperator
  value: string
}

interface InFilter {
  operator: 'in' | 'not in'
  values: (string | number)[]
}

interface BetweenFilter {
  operator: 'between' | 'not between'
  values: [number, number]
}

type NullFilter = 'isNull' | 'isNotNull'

type Filter = 
    | ComparaisonFilter
    | InFilter
    | BetweenFilter
    | NullFilter
    | any


/**
  *  Function to apply filters to a query
  *  @param query - Model query
  *  @param filters - Object of filters to apply
  *  @return Query with applied filters
  */
  export function queryFilters(
      query: ModelQueryBuilderContract<LucidModel, LucidRow>,
      filters: { [field: string]: Filter }
    ): ModelQueryBuilderContract<LucidModel, LucidRow> {
    
    filters = cleanFiltersRequest(query.model, filters)
    // console.log('filters', filters)

    for (const [field, filter] of Object.entries(filters)) {
      if (!filter) continue

      // Relation filter
      if (field.includes('.')) {
        const [relation, relatedField] = field.split('.')
        query = query.whereHas(relation as any, (relatedQuery) =>
          queryFilters(relatedQuery, { [relatedField]: filter })
        ).preload(relation as any)
        continue
      }

      // Comparaison filter
      if (typeof filter === 'object' && 'operator' in filter) {
        const { operator, value, values } = filter as any
        const filteredValues = values && values.length ? values.filter((value: string | number) => value !== null && value !== 'null') : []
        switch (operator) {
          case 'in':
            query = query.whereIn(field, values)
            break
          case 'not in':
            query = query.whereNotIn(field, values)
            break
          case 'between':
            if (filteredValues.length > 1) query = query.whereBetween(field, filteredValues)
            break
          case 'not between':
            if (filteredValues.length > 1) query = query.whereNotBetween(field, filteredValues)
            break
          case 'like':
          case 'not like':
            query = query.where(field, operator, `%${value}%`)
            break
          default:
            if (['>', '>=', '<', '<=', '=', '!='].includes(operator)) {
              query = query.where(field, operator, value)
            }
            break
        }
        continue
      }

      // Preload filter
      if (typeof filter === 'object' && 'preload' in filter) {
        query.preload(field as any)
        continue
      }

      query =
        // Null filter
        filter === 'isNull' ? query.whereNull(field)
        // Not null filter
        : filter === 'isNotNull' ? query.whereNotNull(field)
        // Direct filter
        : query.where(field, filter)
    }

    return query
  }


/**
  *  Function to clean request filters object with model columns and relations
  *  @param Model - Model to apply filters
  *  @param filters - Request filters object
  *  @return cleaned filters object
  */
  function cleanFiltersRequest(
      model: LucidModel,
      filters: { [field: string]: Filter }
    ): { [field: string]: Filter } {

    const relations = [...(model.$relationsDefinitions?.keys() ?? [])]
    const columns = [...(model.$columnsDefinitions?.keys() ?? [])]
    
    filters = Object.fromEntries(
      Object.entries(filters).filter(([key]) => {
        const [relation] = key.split('.')
        return (
          key === 'preload' ||
          columns.includes(key) ||
          relations.includes(key) ||
          relations.includes(relation)
        )
      })
    )

    return filters
  }