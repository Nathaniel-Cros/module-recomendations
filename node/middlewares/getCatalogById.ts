/* eslint-disable @typescript-eslint/no-explicit-any */

async function GetCatalogById(ctx: Context) {
    try {
        const { apisCatalog } = ctx.clients
        const { categoryId } = ctx.query
        console.log('..:: categoryId ::..', categoryId)
        const res: any = await apisCatalog.getCatalogTree(parseInt(categoryId as string))

        ctx.status = 200
        ctx.body = { ...res }
    } catch (e) {
        console.error('..:: Error in clientCatalog middleware ::..', e)
        ctx.status = 500
        ctx.body = {
            error: e,
            message:
                'An error occurred while processing the request in clientCatalog middleware.',
        }
    }
}

export default GetCatalogById
