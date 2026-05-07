const errorHandler = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next()
  } catch (error) {
    // console.log('error message', error)
    if (error.message === 'Request failed with status code 404') {
      ctx.status = 404
      ctx.body = {
        message: error.message,
      }
    } else {
      ctx.status = error.statusCode || error.status || 500
      ctx.body = {
        message: error.message,
      }
    }
  }
}

export default errorHandler
