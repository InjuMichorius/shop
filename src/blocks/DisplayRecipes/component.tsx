import React from 'react'
import type { DisplayRecipesBlock as DisplayRecipesBlockProps } from '@/payload-types'
import { Card } from '@/components/Card'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & DisplayRecipesBlockProps

export const DisplayRecipesBlock: React.FC<Props> = ({ className, title, button, recipes }) => {
  const hasButton = !!(button && button.length > 0 && button[0]?.link)

  return (
    <div className={cn('container mx-auto py-12', className)}>
      <div className="grid gap-8 md:grid-cols-12">
        {title && (
          <h2
            className={cn(
              'text-3xl font-bold',
              'order-1 md:order-1',
              hasButton ? 'md:col-span-8' : 'md:col-span-12',
            )}
          >
            {title}
          </h2>
        )}
        {recipes && recipes.length > 0 && (
          <div
            className={cn(
              'order-2 md:order-3',
              'md:col-span-12',
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            )}
          >
            {recipes.map((recipe, index) => {
              if (typeof recipe.recipe === 'object' && recipe.recipe) {
                return (
                  <Card
                    key={index}
                    doc={recipe.recipe}
                    relationTo="recipes"
                    showCategories={true}
                  />
                )
              }
              return null
            })}
          </div>
        )}
        {hasButton && (
          <div
            className={cn(
              'order-3 md:order-2',
              'md:col-span-4 md:col-start-9',
              'md:self-end md:justify-self-end',
              'flex justify-start',
            )}
          >
            <CMSLink {...button![0]!.link} />
          </div>
        )}
      </div>
    </div>
  )
}
