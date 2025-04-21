import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Recipe } from '../../../payload-types'

export const revalidateRecipe: CollectionAfterChangeHook<Recipe> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/recipes/${doc.slug}`

      payload.logger.info(`Revalidating recipe at path: ${path}`)

      revalidatePath(path)
      revalidateTag('recipes-sitemap')
    }

    // If the recipe was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/recipes/${previousDoc.slug}`

      payload.logger.info(`Revalidating old recipe at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('recipes-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Recipe> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/recipes/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('recipes-sitemap')
  }

  return doc
}
