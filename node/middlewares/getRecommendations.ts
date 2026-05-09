/* eslint-disable @typescript-eslint/no-explicit-any */

async function getRecommendations(ctx: Context) {
  try {
    const { workspace } = ctx.vtex
    const { categoryId } = ctx.query

    if (!categoryId) {
      ctx.status = 400
      ctx.body = { message: 'Missing required query param: categoryId' }

      return
    }

    const data: any = await ctx.clients.vbase.getJSON(
      workspace,
      'relations',
      true
    )

    if (!data || !Array.isArray(data.relations)) {
      ctx.status = 404
      ctx.body = { message: 'No recommendations configured yet.' }

      return
    }

    const match = data.relations.find(
      (r: any) => String(r.source.id) === String(categoryId)
    )

    if (!match) {
      ctx.status = 404
      ctx.body = {
        message: `No recommendations configured for categoryId ${categoryId}`,
      }

      return
    }

    ctx.status = 200
    ctx.body = {
      categoryId: match.source.id,
      categoryName: match.source.name,
      recommendations: match.targets,
    }
  } catch (e) {
    console.error('..:: Error in getRecommendations middleware ::..', e)
    ctx.status = 500
    ctx.body = {
      error: e,
      message: 'An error occurred while fetching recommendations.',
    }
  }
}

export default getRecommendations
