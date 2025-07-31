import React from 'react'
import Link from 'next/link'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

// Accept categories as prop
export type CategoryHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      categories?: any[]
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
      categories?: any[]
    })

export const CategoryHero: React.FC<CategoryHeroType> = ({ children, richText, categories }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-3 pb-3 bg-beige text-white gap-4 min-h-[30rem]">
      <div className="flex flex-wrap gap-8 justify-center px-2 py-12">
        {Array.isArray(categories) &&
          categories.length > 0 &&
          categories.map((cat, i) => {
            const title = typeof cat === 'object' && cat !== null ? cat.title : String(cat)
            const slug = typeof cat === 'object' && cat !== null ? cat.slug : null
            const image = typeof cat === 'object' && cat !== null ? cat.image : null

            return (
              <Link
                key={cat.id || cat.slug || i}
                href={`/categories/${slug}`}
                className="group flex flex-col items-center gap-2"
              >
                {image && (
                  <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden bg-white">
                    <Media
                      resource={image}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-black">{title}</span>
              </Link>
            )
          })}
      </div>
    </div>
  )
}
