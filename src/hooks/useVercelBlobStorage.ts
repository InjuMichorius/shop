import type { Media } from '@/payload-types'
import { uploadToBlob } from '@/utilities/blobStorage'

export const useVercelBlobStorage = () => {
  const handleUpload = async (file: File): Promise<Partial<Media>> => {
    try {
      const url = await uploadToBlob(file)

      return {
        filename: file.name,
        mimeType: file.type,
        url,
        width: 0, // These will be updated after upload
        height: 0,
      }
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error)
      throw error
    }
  }

  return {
    handleUpload,
  }
}
