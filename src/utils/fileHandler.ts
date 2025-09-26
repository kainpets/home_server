import { promises as fs } from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'

export interface FileInfo {
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
}

export class FileHandler {
  private uploadDir: string
  private allowedTypes: string[]

  constructor(uploadDir: string = "./uploads/photos") {
    this.uploadDir = uploadDir
    this.allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  }

  private generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName)
    const randomName = randomBytes(16).toString('hex')
    return `${randomName}${ext}`
  }

  validateFileType(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType)
  }

  validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return size <= maxSize
  }

  async saveFile(file: any): Promise<FileInfo> {
    const uniqueFilename = this.generateUniqueFilename(file.filename)
    const filePath = path.join(this.uploadDir, uniqueFilename)

    await fs.mkdir(this.uploadDir, { recursive: true })

    await fs.writeFile(filePath, await file.toBuffer())

    return {
      filename: uniqueFilename,
      originalName: file.filename,
      filePath: filePath,
      fileSize: file.file.bytesRead,
      mimeType: file.mimetype
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
}