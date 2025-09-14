import { photos } from '../database/schema'
import { db } from '../database/connection'
import type { FastifyInstance } from 'fastify'

export const photoRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(require('@fastify/multipart'))

  fastify.get('/photos', async (request, reply) => {
    const allPhotots = await db.select().from(photos)
    return { photos: allPhotots }
  })

  fastify.post('/photos', async (request, reply) => {
    return { message: 'Photo uploaded successfully' }
  })
}