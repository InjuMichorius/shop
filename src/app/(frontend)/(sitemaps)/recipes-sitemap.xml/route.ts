import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getRecipesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'recipes',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((recipe) => Boolean(recipe?.slug))
          .map((recipe) => ({
            loc: `${SITE_URL}/recipes/${recipe?.slug}`,
            lastmod: recipe.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['recipes-sitemap'],
  {
    tags: ['recipes-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getRecipesSitemap()

  return getServerSideSitemap(sitemap)
}
