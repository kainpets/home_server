import Fastify, { type FastifyInstance, type RouteShorthandOptions } from 'fastify'
import { photoRoutes } from './routes/photos'

const server: FastifyInstance = Fastify({})

server.register(photoRoutes)

server.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' }
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })
    console.log('Server is running on port 3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()