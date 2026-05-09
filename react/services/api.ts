const APP_PREFIX = '/v1'

export interface Category {
  id: string
  name: string
  hasChildren: boolean
  url: string
  children: Category[]
}

export interface RelationNode {
  id: string
  name: string
}

export interface Relation {
  source: RelationNode
  targets: RelationNode[]
}

export interface RelationsResponse {
  updatedAt: string | null
  relations: Relation[]
}

export const fetchCatalogTree = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${APP_PREFIX}/getCatalogTree`)

    if (!response.ok) throw new Error('Failed to fetch catalog tree')

    return await response.json()
  } catch (error) {
    console.error('Error fetching catalog tree:', error)
    throw error
  }
}

export const fetchRelations = async (): Promise<RelationsResponse> => {
  try {
    const response = await fetch(`${APP_PREFIX}/relations`)

    if (!response.ok) throw new Error('Failed to fetch relations')

    return await response.json()
  } catch (error) {
    console.error('Error fetching relations:', error)
    throw error
  }
}

export const saveRelations = async (relations: Relation[]): Promise<any> => {
  try {
    const response = await fetch(`${APP_PREFIX}/relations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ relations }),
    })

    if (!response.ok) throw new Error('Failed to save relations')

    return await response.json()
  } catch (error) {
    console.error('Error saving relations:', error)
    throw error
  }
}
