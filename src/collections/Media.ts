import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { put } from '@vercel/blob'
import mime from 'mime-types'
import { Readable } from 'stream'
import path from 'path'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Media as MediaType } from '@/payload-types'

const beforeChange: CollectionBeforeChangeHook = async (args) => {
  const { data } = args
  const file = (args as any).file

  if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    throw new Error('VERCEL_BLOB_READ_WRITE_TOKEN is not set')
  }

  if (file) {
    try {
      const blob = await put(file.name, file as unknown as globalThis.File, {
        access: 'public',
        contentType: file.type,
      })

      return {
        ...data,
        url: blob.url,
        filename: file.name,
        mimeType: file.type,
        filesize: file.size,
        width: 0, // These will be updated after upload
        height: 0,
      }
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error)
      throw error
    }
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
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
  },
  hooks: {
    beforeChange: [beforeChange],
    afterChange: [
      async ({ doc, req }) => {
        const filename = doc?.filename
        if (!filename) return

        const filePath = path.resolve(process.cwd(), 'media', filename)
        const fs = await import('fs/promises')

        try {
          const buffer = await fs.readFile(filePath)
          const stream = Readable.from(buffer)

          const blob = await put(filename, stream, {
            access: 'public',
            token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN!,
            contentType: mime.lookup(filename) || 'application/octet-stream',
          })

          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              url: blob.url,
            },
          })
        } catch (err) {
          console.error('Upload to Vercel Blob failed:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
