'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/export/csv')
      if (!res.ok) throw new Error('Erreur export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'feedbacks.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <Download size={13} />
      {loading ? 'Export...' : 'Exporter CSV'}
    </button>
  )
}
