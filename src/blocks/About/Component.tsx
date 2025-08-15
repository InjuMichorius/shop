// components/blocks/AboutBlock.tsx
import React from 'react'
import type { AboutBlock as AboutBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & AboutBlockProps

export const AboutBlock: React.FC<Props> = ({ title, text, media }) => {
  return (
    <div className="pt-3 pb-3 bg-beige text-black">
      <div className="container mx-auto py-12 flex flex-col-reverse md:flex-row items-center place-content-between gap-[3rem]">
        <div>
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {text && <RichText data={text} className="p-0" />}
        </div>

        {media && (
          <Media
            resource={media}
            className="w-[20rem]"
            imgClassName="rounded-full aspect-square object-cover"
          />
        )}
      </div>
    </div>
  )
}
