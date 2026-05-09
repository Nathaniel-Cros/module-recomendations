/* eslint-disable @typescript-eslint/no-explicit-any */

async function getRelations(ctx: Context) {
  try {
    const { workspace } = ctx.vtex
    const data: any = await ctx.clients.vbase.getJSON(
      workspace,
      'relations',
      true
    )

    if (!data) {
      ctx.status = 200
      ctx.body = { updatedAt: null, relations: [] }

      return
    }

    ctx.status = 200
    ctx.body = data
  } catch (e) {
    console.error('..:: Error in getRelations middleware ::..', e)
    ctx.status = 500
    ctx.body = {
      error: e,
      message: 'An error occurred while fetching relations.',
    }
  }
}

export default getRelations
