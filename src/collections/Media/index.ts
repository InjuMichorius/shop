import type { CollectionConfig } from 'payload'
import { put } from '@vercel/blob'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    handlers: {
      upload: async ({ file }) => {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error('BLOB_READ_WRITE_TOKEN is not set')
        }

        try {
          const blob = await put(file.name, file, {
            access: 'public',
            contentType: file.type,
          })

          return {
            filename: file.name,
            mimeType: file.type,
            filesize: file.size,
            url: blob.url,
            width: 0, // These will be updated after upload
            height: 0,
          }
        } catch (error) {
          console.error('Error uploading to Vercel Blob:', error)
          throw error
        }
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
