'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Page, Recipe } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'recipes'
    value: Page | Recipe | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const pathname = usePathname()

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const isActive = href === '/' ? pathname === href : href && pathname.startsWith(href)
  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const linkClassName = cn(className, {
    'font-bold': isActive,
  })

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={linkClassName} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={linkClassName} size={size} variant={appearance}>
      <Link href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
