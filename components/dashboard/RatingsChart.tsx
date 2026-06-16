'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Feedback {
  rating: number
  createdAt: Date
  project: { id: string; name: string } | null
}

interface Project {
  id: string
  name: string
}

interface Props {
  feedbacks: Feedback[]
  projects: Project[]
}

const PERIODS = [
  { label: '7 jours', days: 7 },
  { label: '30 jours', days: 30 },
  { label: '90 jours', days: 90 },
]

export default function RatingsChart({ feedbacks, projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [period, setPeriod] = useState(30)

  const chartData = useMemo(() => {
    const now = new Date()
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - period)

    const filtered = feedbacks.filter((f) => {
      const date = new Date(f.createdAt)
      if (date < cutoff) return false
      if (selectedProject !== 'all' && f.project?.id !== selectedProject) return false
      return true
    })

    // Grouper par jour
    const byDay: Record<string, number[]> = {}
    for (let i = 0; i < period; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - (period - 1 - i))
      byDay[d.toISOString().slice(0, 10)] = []
    }

    filtered.forEach((f) => {
      const key = new Date(f.createdAt).toISOString().slice(0, 10)
      if (byDay[key]) byDay[key].push(f.rating)
    })

    return Object.entries(byDay).map(([date, ratings]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      moyenne: ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null,
      avis: ratings.length,
    }))
  }, [feedbacks, selectedProject, period])

  const hasData = chartData.some((d) => d.moyenne !== null)

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display font-semibold text-stone-800">Évolution des notes</h2>
          <p className="text-xs text-stone-400 mt-0.5">Note moyenne par jour</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtre projet */}
          {projects.length > 0 && (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 text-stone-600 bg-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">Tous les projets</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {/* Filtre période */}
          <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                onClick={() => setPeriod(p.days)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  period === p.days
                    ? 'bg-white text-stone-800 shadow-sm font-medium'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-stone-400 text-sm">
          Pas encore de données sur cette période.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={false}
              interval={period === 7 ? 0 : period === 30 ? 4 : 13}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length || payload[0].value === null) return null
                return (
                  <div className="bg-white border border-stone-100 rounded-xl shadow-lg px-3 py-2 text-xs">
                    <p className="text-stone-400 mb-1">{label}</p>
                    <p className="font-semibold text-stone-800">⭐ {payload[0].value} / 5</p>
                    <p className="text-stone-400">{payload[1]?.value} avis</p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="moyenne"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#ratingGradient)"
              connectNulls
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="avis"
              stroke="transparent"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
