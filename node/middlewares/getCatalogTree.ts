/* eslint-disable @typescript-eslint/no-explicit-any */

async function GetCatalogTree(ctx: Context) {
  try {
    const { apisCatalog } = ctx.clients
    const { level } = ctx.query
    const res: any = await apisCatalog.getCatalogTree(
      parseInt((level as string) || '1', 10)
    )

    ctx.status = 200
    ctx.body = res
  } catch (e) {
    // console.error('..:: Error in GetCatalogTree middleware ::..', e)
    ctx.status = 500
    ctx.body = {
      error: e,
      message:
        'An error occurred while processing the request in GetCatalogTree middleware.',
    }
  }
}

export default GetCatalogTree
