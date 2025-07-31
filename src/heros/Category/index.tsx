import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type CategoryHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const CategoryHero: React.FC<CategoryHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      test test test
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
