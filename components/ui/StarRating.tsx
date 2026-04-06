'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 14, md: 20, lg: 32 }

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const px = sizes[size]
  const active = hovered || value

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform duration-100 ${
            !readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          }`}
        >
          <Star
            width={px}
            height={px}
            className={`transition-colors duration-150 ${
              star <= active
                ? 'fill-amber-400 stroke-amber-400'
                : 'fill-none stroke-stone-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
