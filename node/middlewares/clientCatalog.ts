/* eslint-disable @typescript-eslint/no-explicit-any */

async function clientCatalog(ctx: Context) {
  try {
    const { apiCatalog } = ctx.clients
    const { categoryId } = ctx.query

    // console.log('..:: categoryId ::..', categoryId)
    const res: any = await apiCatalog.getCategoryById(categoryId as string)

    ctx.status = 200
    ctx.body = { ...res }
  } catch (e) {
    // console.error('..:: Error in clientCatalog middleware ::..', e)
    ctx.status = 500
    ctx.body = {
      error: e,
      message:
        'An error occurred while processing the request in clientCatalog middleware.',
    }
  }
}

export default clientCatalog
