/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from 'co-body'

async function saveRelations(ctx: Context) {
  try {
    const { workspace } = ctx.vtex
    const body: any = await json(ctx.req)

    if (!body || !Array.isArray(body.relations)) {
      ctx.status = 400
      ctx.body = { message: 'Invalid payload. Expected { relations: [...] }' }

      return
    }

    await ctx.clients.vbase.saveJSON(workspace, 'relations', {
      updatedAt: new Date().toISOString(),
      relations: body.relations,
    })

    ctx.status = 200
    ctx.body = { message: 'Relations saved successfully.' }
  } catch (e) {
    console.error(
      '..:: Error in saveRelations middleware ::..',
      e.response?.data || e
    )
    ctx.status = 500
    ctx.body = {
      error: e.response?.data || e,
      message: 'An error occurred while saving relations.',
    }
  }
}

export default saveRelations
