import { method, Service } from '@vtex/api'
import type { ClientsConfig, ServiceContext } from '@vtex/api'

import { Clients } from './clients'
import {
  ErrorHandler,
  clientCatalog,
  getCatalogTree,
  getCatalogById,
  getRelations,
  saveRelations,
  getRecommendations,
} from './middlewares'

const TEN_SECONDS_MS = 10 * 1000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 3,
      timeout: TEN_SECONDS_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients>
}

export default new Service({
  clients,
  routes: {
    getCatalogClientById: method({
      GET: [ErrorHandler, clientCatalog],
    }),
    getCatalogTree: method({
      GET: [ErrorHandler, getCatalogTree],
    }),
    getCatalogById: method({
      GET: [ErrorHandler, getCatalogById],
    }),
    getRelations: method({
      GET: [ErrorHandler, getRelations],
      POST: [ErrorHandler, saveRelations],
    }),
    getRecommendations: method({
      GET: [ErrorHandler, getRecommendations],
    }),
  },
})
