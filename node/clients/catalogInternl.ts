import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class ApisCatalog extends JanusClient {
    constructor(ctx: IOContext, options?: InstanceOptions) {
        super(ctx, {
            ...options,
            headers: {
                Accept: 'application/json',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                VtexIdclientAutCookie: ctx.authToken,
                'x-vtex-user-agent': ctx.userAgent,
                ...options?.headers,
            },
        })
    }

    public getCategoryById(categoryId: string) {
        return this.http.get(this.routes.categoryById(categoryId))
    }

    public getCatalogTree(level: number) {
        return this.http.get(this.routes.catalogTree(level))
    }

    private get routes() {
        const base = '/api'

        return {
            catalogTree: (level: number) =>
                `${base}/catalog_system/pub/category/tree/${level}`,
            categoryById: (categoryId: string) =>
                `${base}/catalog/pvt/category/${categoryId}?includeTreePath=true`,
        }
    }
}
