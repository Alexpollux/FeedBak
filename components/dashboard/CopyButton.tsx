'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors"
      title="Copier le lien"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-500" />
          <span className="text-emerald-500">Copié !</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          Copier
        </>
      )}
    </button>
  )
}
