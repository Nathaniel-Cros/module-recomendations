import { method, Service } from '@vtex/api'
import type { ClientsConfig, ServiceContext } from '@vtex/api'

import { Clients } from './clients'
import { ErrorHandler, clientCatalog, getCatalogTree, getCatalogById } from './middlewares'

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
  },
})
