import { IOClients } from '@vtex/api'
import { Catalog } from '@vtex/clients'

import ApisCatalog from "./catalogInternl";

export class Clients extends IOClients {

  public get apiCatalog(): Catalog {
    return this.getOrSet('apiCatalog', Catalog)
  }

  public get apisCatalog(): ApisCatalog {
    return this.getOrSet('apisCatalog', ApisCatalog)
  }
}
