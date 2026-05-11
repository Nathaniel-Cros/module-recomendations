/* eslint-disable @typescript-eslint/no-explicit-any */

async function searchProducts(ctx: Context) {
  try {
    const { apisCatalog } = ctx.clients
    // Esperamos un query param con las categorías separadas por coma, ej: ?categoryIds=1,2,3
    const { categoryIds } = ctx.query

    if (!categoryIds) {
      ctx.status = 400
      ctx.body = { error: 'Missing categoryIds query parameter' }

      return
    }

    const idsArray = (categoryIds as string).split(',')

    // Ejecutar múltiples promesas en paralelo
    const promises = idsArray.map(id => apisCatalog.searchProducts(id.trim()))

    // Cacharlas con Promise.all
    const results = await Promise.all(promises)

    // Formatear el resultado: podemos juntar todo o devolver un mapa por categoría
    // Aquí devolveremos un objeto donde cada llave es el ID de la categoría y su valor es el array de productos
    const responseData = idsArray.reduce((acc: any, id, index) => {
      acc[id.trim()] = results[index]

      return acc
    }, {})

    ctx.status = 200
    ctx.body = responseData
  } catch (e) {
    ctx.status = 500
    ctx.body = {
      error: e,
      message:
        'An error occurred while processing the request in searchProducts middleware.',
    }
  }
}

export default searchProducts
