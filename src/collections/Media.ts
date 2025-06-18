import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { put } from '@vercel/blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const beforeChange: CollectionBeforeChangeHook = async (args) => {
  const { data } = args
  const file = (args as { file?: File }).file

  // Check for required environment variables
  if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    console.error('VERCEL_BLOB_READ_WRITE_TOKEN is not set in environment variables')
    throw new Error('VERCEL_BLOB_READ_WRITE_TOKEN is not set')
  }

  if (file) {
    try {
      console.log('Starting file upload to Vercel Blob:', {
        filename: file.name,
        size: file.size,
        type: file.type,
        hasToken: !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      })

      const blob = await put(file.name, file as unknown as globalThis.File, {
        access: 'public',
        contentType: file.type,
      })

      console.log('File uploaded successfully to Vercel Blob:', {
        url: blob.url,
        filename: file.name,
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
      console.error('Error uploading to Vercel Blob:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        filename: file.name,
        size: file.size,
        type: file.type,
      })
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
