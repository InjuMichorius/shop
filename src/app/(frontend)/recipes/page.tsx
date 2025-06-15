import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const recipes = await payload.find({
    collection: 'recipes',
    depth: 2,
    limit: 12,
    // @ts-expect-error: Payload types don't support string[] for populate yet
    populate: ['meta.image'],
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Alle recepten</h1>
        </div>
      </div>
      <div className="container mb-8">
        <PageRange
          collection="recipes"
          currentPage={recipes.page}
          limit={12}
          totalDocs={recipes.totalDocs}
        />
      </div>
      eerste recipe:
      <pre>{JSON.stringify(recipes.docs[0], null, 2)}</pre>
      <CollectionArchive recipes={recipes.docs} />
      <div className="container">
        {recipes.totalPages > 1 && recipes.page && (
          <Pagination page={recipes.page} totalPages={recipes.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Recipes`,
  }
}
