'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Recipe } from '@/payload-types'

import { ImageMedia } from '@/components/Media/ImageMedia'

export type CardRecipeData = Pick<Recipe, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardRecipeData
  relationTo?: 'recipes'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      tabIndex={0}
      className={cn('overflow-hidden hover:cursor-pointer group relative', className)}
      ref={card.ref}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {!metaImage && <p>No image</p>}
        {metaImage && typeof metaImage === 'object' && (
          <ImageMedia
            resource={metaImage}
            imgClassName="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

        {showCategories && hasCategories && (
          <ul className="absolute bottom-2 left-2 text-sm flex gap-2 z-10">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const title = category.title || 'Untitled category'

                return (
                  <li
                    key={index}
                    style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}
                    className={cn(
                      'bg-white rounded-full px-2 py-1 transform transition-all duration-300 ease-out',
                      'xl:translate-y-4 xl:opacity-0 xl:[transition-delay:0ms]',
                      'xl:group-hover:translate-y-0 xl:group-hover:opacity-100 xl:group-hover:[transition-delay:var(--delay)]',
                      'xl:group-focus-visible:translate-y-0 xl:group-focus-visible:opacity-100 xl:group-focus-visible:[transition-delay:var(--delay)]',
                    )}
                  >
                    {title}
                  </li>
                )
              }
              return null
            })}
          </ul>
        )}
      </div>
      <div>
        {titleToUse && <h3 className="line-clamp-2 text-xl/6 font-bold mt-3">{titleToUse}</h3>}
        {description && (
          <div className="mt-2">
            <p className="line-clamp-3">{sanitizedDescription}</p>
          </div>
        )}
      </div>

      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={titleToUse || 'Card link'}
        ref={link.ref}
      />
    </article>
  )
}
