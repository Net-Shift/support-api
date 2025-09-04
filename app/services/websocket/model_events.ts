// Types pour les événements de modèles génériques
export type ModelEventAction = 'created' | 'updated' | 'deleted'

export interface ModelEventPayload<T = any> {
  model: string
  action: ModelEventAction
  data: T
  accountId: string
  timestamp: Date
}

// Interface pour les modèles observables
export interface ObservableModel {
  id: string
  accountId: string
}

// Configuration des relations à inclure pour chaque modèle
const MODEL_RELATIONS: Record<string, string[]> = {
  Order: ['orderItems', 'table', 'table.room'],
  OrderItem: ['order', 'order.table'],
  Room: ['tables'],
  Table: ['room', 'orders'],
  Item: ['itemType', 'tags'],
  User: ['account']
}

/**
 * Relations sensibles qui ne doivent jamais être incluses
 */
const FORBIDDEN_RELATIONS = [
  'password',
  'passwordReset',
  'qrToken.token',
  'user.password',
]

/**
 * Vérifie si une relation est autorisée
 */
function isRelationAllowed(relation: string): boolean {
  return !FORBIDDEN_RELATIONS.some(forbidden => 
    relation.includes(forbidden) || forbidden.includes(relation)
  )
}

/**
 * Obtient les relations configurées pour un modèle
 */
function getModelRelations(modelName: string): string[] {
  const relations = MODEL_RELATIONS[modelName] || []
  return relations.filter(isRelationAllowed)
}

// Classe principale pour gérer les événements de modèles
export class ModelEventEmitter {
  private static instance: ModelEventEmitter
  private websocketService: any

  private constructor() {}

  public static getInstance(): ModelEventEmitter {
    if (!ModelEventEmitter.instance) {
      ModelEventEmitter.instance = new ModelEventEmitter()
    }
    return ModelEventEmitter.instance
  }

  public setWebSocketService(ws: any) {
    this.websocketService = ws
  }

  public async emit(
    modelName: string, 
    action: ModelEventAction, 
    modelInstance: any
  ) {
    if (!this.websocketService) {
      console.warn('WebSocket service not initialized')
      return
    }

    let data: any

    if (action === 'deleted') {
      // Pour les suppressions, on n'a que l'ID et accountId
      data = {
        id: modelInstance.id,
        accountId: modelInstance.accountId
      }
    } else {
      // Pour created/updated, on charge les relations
      try {
        const relations = getModelRelations(modelName)
        if (relations.length > 0) {
          // Recharger l'instance avec les relations
          const ModelClass = modelInstance.constructor
          const query = ModelClass.query().where('id', modelInstance.id)
          
          // Charger les relations une par une pour gérer les nested relations
          for (const relation of relations) {
            if (relation.includes('.')) {
              // Relations imbriquées comme 'table.room'
              const [parentRel, childRel] = relation.split('.')
              query.preload(parentRel, (subQuery: any) => {
                subQuery.preload(childRel)
              })
            } else {
              // Relations simples
              query.preload(relation)
            }
          }
          
          const populatedInstance = await query.first()
          data = populatedInstance ? populatedInstance.toJSON() : modelInstance.toJSON()
        } else {
          data = modelInstance.toJSON()
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des relations pour ${modelName}:`, error)
        data = modelInstance.toJSON()
      }
    }

    const event = `${modelName.toLowerCase()}_${action}`
    const payload: ModelEventPayload = {
      model: modelName.toLowerCase(),
      action,
      data,
      accountId: data.accountId || data.account_id,
      timestamp: new Date()
    }

    // console.log(`Emitting model event: ${event}`, payload)
    this.websocketService.emitModelEvent(data.accountId || data.account_id, event, payload)
  }
}

export default ModelEventEmitter.getInstance()