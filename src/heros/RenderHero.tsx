import React from 'react'

import type { Page } from '@/payload-types'

import { CategoryHero } from '@/heros/Category'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  category: CategoryHero,
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  if (type === 'category') {
    // Type assertion needed due to complex union types between Page hero and CategoryHero props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CategoryHero {...(props as any)} />
  }

  // Type assertion needed due to complex union types between Page hero and hero component props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <HeroToRender {...(props as any)} />
}
