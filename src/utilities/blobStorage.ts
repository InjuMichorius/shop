import { put } from '@vercel/blob'
import { getServerSideURL } from './getURL'

export async function uploadToBlob(file: File) {
  try {
    const blob = await put(file.name, file, {
      access: 'public',
    })

    return blob.url
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error)
    throw error
  }
}

export function getBlobUrl(url: string) {
  // If the URL is already a Vercel Blob URL, return it as is
  if (url.includes('.vercel.app')) {
    return url
  }

  // Otherwise, assume it's a local URL and prepend the server URL
  return `${getServerSideURL()}${url}`
}
