/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

async function searchProducts(ctx: Context) {
  try {
    const { apisCatalog, vbase } = ctx.clients
    const { workspace } = ctx.vtex
    const { fq } = ctx.query

    if (!fq) {
      ctx.status = 400
      ctx.body = { error: 'Missing fq query parameter' }

      return
    }

    // Extraemos el path de la categoría (ej: de C:/4/21/ a 4/21/)
    let categoryPath = String(fq).replace('C:/', '')

    // Normalizamos para que coincida con el formato de VBase (ej: "4/16/")
    // Aseguramos que no empiece con slash y que siempre termine con slash
    if (categoryPath.startsWith('/')) {
      categoryPath = categoryPath.substring(1)
    }

    if (!categoryPath.endsWith('/')) {
      categoryPath += '/'
    }

    // Leer las relaciones guardadas en VBase
    const data: any = await vbase.getJSON(workspace, 'relations', true)

    // Buscar la relación cuyo source coincida con el categoryPath
    const relation =
      data && Array.isArray(data.relations)
        ? data.relations.find(
            (r: any) => String(r.source.id) === String(categoryPath)
          )
        : null

    // Si no hay relación o no tiene targets, buscamos los productos de la categoría original
    if (
      !relation ||
      !Array.isArray(relation.targets) ||
      relation.targets.length === 0
    ) {
      const products = await apisCatalog.searchProducts(categoryPath)

      // Mezclamos también en el fallback para mantener consistencia
      const shuffledProducts = (products as any[]).sort(
        () => Math.random() - 0.5
      )

      ctx.status = 200
      ctx.body = { products: shuffledProducts }

      return
    }

    // Si hay relación, buscamos productos de cada categoría target en paralelo
    const productsByTarget = await Promise.all(
      relation.targets.map((target: any) =>
        apisCatalog.searchProducts(String(target.id))
      )
    )

    // Aplanar todos los arrays de productos en uno solo
    const products = (productsByTarget as any[]).flat()

    // Mezclamos los productos de forma aleatoria para que no aparezcan en bloques por categoría
    const shuffledProducts = products.sort(() => Math.random() - 0.5)

    ctx.status = 200
    ctx.body = { products: shuffledProducts }
  } catch (e) {
    console.error('..:: Error in searchProducts middleware ::..', e)
    ctx.status = 500
    ctx.body = {
      error: e,
      message:
        'An error occurred while processing the request in searchProducts middleware.',
    }
  }
}

export default searchProducts
