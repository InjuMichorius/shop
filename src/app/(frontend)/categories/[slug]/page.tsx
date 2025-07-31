import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

export default async function CategoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await paramsPromise

  const payload = await getPayload({ config: configPromise })

  // Find the category by slug
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const category = categoryResult.docs[0]
  if (!category) return notFound()

  // Find recipes that reference this category
  const recipesResult = await payload.find({
    collection: 'recipes',
    where: {
      categories: { equals: category.id },
    },
    limit: 12, // match the recipes page limit
    depth: 2,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Recepten in {category.title}</h1>
        </div>
      </div>
      <div className="container mb-8">
        <PageRange
          collection="recipes"
          currentPage={recipesResult.page}
          limit={12}
          totalDocs={recipesResult.totalDocs}
        />
      </div>
      <CollectionArchive recipes={recipesResult.docs} />
      {recipesResult.docs.length === 0 && (
        <div className="container mt-8">
          <p>Geen recepten gevonden in deze categorie.</p>
        </div>
      )}
      <div className="container">
        {recipesResult.totalPages > 1 && recipesResult.page && (
          <Pagination page={recipesResult.page} totalPages={recipesResult.totalPages} />
        )}
      </div>
    </div>
  )
}
