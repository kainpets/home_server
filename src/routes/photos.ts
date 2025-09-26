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
      console.log('Upload started...')
      const data = await request.file()
      console.log('File received:', data?.filename)
  
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }
  
      console.log('Validating file type:', data.mimetype)
      if (!fileHandler.validateFileType(data.mimetype)) {
        return reply.code(400).send({ error: 'Invalid file type' })
      }
  
      console.log('Validating file size:', data.file.bytesRead)
      if (!fileHandler.validateFileSize(data.file.bytesRead)) {
        return reply.code(400).send({ error: 'File too large' })
      }
  
      console.log('Saving file...')
      const fileInfo = await fileHandler.saveFile(data)
      console.log('File saved:', fileInfo)
  
      console.log('Inserting to database...')
      const [newPhoto] = await db.insert(photos).values({
        title: data.filename,
        filename: fileInfo.filename,
        filePath: fileInfo.filePath,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
      }).returning()
  
      console.log('Database insert successful:', newPhoto)
      return { message: 'Photo uploaded successfully', photo: newPhoto }
    } catch (error) {
      console.error('Upload error:', error)
      return reply.code(500).send({ error: 'Upload failed' })
    }
  })
}