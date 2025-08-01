import React from 'react'
import type { DisplayRecipesBlock as DisplayRecipesBlockProps } from '@/payload-types'
import { Card } from '@/components/Card'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
} & DisplayRecipesBlockProps

export const DisplayRecipesBlock: React.FC<Props> = ({ className, title, button, recipes }) => {
  return (
    <div className={cn('container mx-auto py-12', className)}>
      <div className="flex justify-between items-center mb-8">
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
        {button && button.length > 0 && button[0]?.link && (
          <div className="flex justify-end">
            <CMSLink {...button[0].link} />
          </div>
        )}
      </div>

      {recipes && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => {
            if (typeof recipe.recipe === 'object' && recipe.recipe) {
              return (
                <Card key={index} doc={recipe.recipe} relationTo="recipes" showCategories={true} />
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
