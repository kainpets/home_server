import { photos } from '../database/schema'
import { db } from '../database/connection'
import type { FastifyInstance } from 'fastify'
import { FileHandler } from '../utils/fileHandler'
import multipart from '@fastify/multipart'

const fileHandler = new FileHandler()

export const photoRoutes = async (fastify: FastifyInstance) => {
  await fastify.register(multipart)

  fastify.get('/photos', async (request, reply) => {
    const allPhotots = await db.select().from(photos)
    return { photos: allPhotots }
  })

  fastify.post('/photos', async (request, reply) => {
    try {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }

      if (!fileHandler.validateFileType(data.mimetype)) {
        return reply.code(400).send({ error: 'Invalid file type' })
      }

      if (!fileHandler.validateFileSize(data.file.bytesRead)) {
        return reply.code(400).send({ error: 'File too large' })
      }

      const fileInfo = await fileHandler.saveFile(data)

      const [newPhoto] = await db.insert(photos).values({
        title: data.filename,
        filename: fileInfo.filename,
        filePath: fileInfo.filePath,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        ownerId: 1
      }).returning()

      return { message: 'Photo uploaded successfully' }
    } catch (error) {
      return reply.code(500).send({ error: 'Upload failed' })
    }
  })
}