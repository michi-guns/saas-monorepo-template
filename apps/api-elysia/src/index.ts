import { Elysia } from 'elysia'

const port = Number(process.env.PORT ?? 3001)

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { message: 'Route not found' }
    }

    set.status = 500
    return {
      message: error instanceof Error ? error.message : 'Internal server error',
    }
  })
  .get('/', () => ({
    name: 'api-elysia',
    status: 'ok',
    runtime: 'bun',
  }))
  .get('/health', () => ({ status: 'ok' }))
  .listen(port)

console.log(`🦊 Elysia is running at ${app.server?.url ?? `http://localhost:${port}`}`)