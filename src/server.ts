import Fastify, { type FastifyInstance, type RouteShorthandOptions } from 'fastify'
import { photoRoutes } from './routes/photos'
import path from 'path'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'

const server: FastifyInstance = Fastify({})

// Register CORS plugin
server.register(fastifyCors, {
  origin: true, // Allow all origins
  credentials: true
})

// Register photo routes first
server.register(photoRoutes)

// Register static file serving for public files
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
  decorateReply: false
})

// Serve uploaded photos
server.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false
})

server.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' }
})

const start = async () => {
  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0'  // Listen on all network interfaces
    })
    console.log('Server is running on port 3000')
    console.log('Local access: http://localhost:3000')
    console.log('Network access: http://[YOUR_IP]:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()