'use client'

import { useState } from 'react'

interface Project {
  id: string
  name: string
  order: number
}

interface Props {
  enableFirstName: boolean
  enableLastName: boolean
  projects: Project[]
  projectLimit: number
}

export default function ProSettings({
  enableFirstName: initialFirstName,
  enableLastName: initialLastName,
  projects: initialProjects,
  projectLimit,
}: Props) {
  const [enableFirstName, setEnableFirstName] = useState(initialFirstName)
  const [enableLastName, setEnableLastName] = useState(initialLastName)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [newProject, setNewProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingProject, setAddingProject] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const toggleField = async (field: 'enableFirstName' | 'enableLastName', value: boolean) => {
    if (field === 'enableFirstName') setEnableFirstName(value)
    else setEnableLastName(value)

    await fetch('/api/dashboard/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
  }

  const saveFields = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    const res = await fetch('/api/dashboard/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enableFirstName, enableLastName }),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess('Paramètres sauvegardés.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError('Erreur lors de la sauvegarde.')
    }
  }

  const addProject = async () => {
    if (!newProject.trim()) return
    setAddingProject(true)
    setError('')
    const res = await fetch('/api/dashboard/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProject.trim() }),
    })
    const data = await res.json()
    setAddingProject(false)
    if (res.ok) {
      setProjects((prev) => [...prev, data])
      setNewProject('')
    } else {
      setError(data.error ?? 'Erreur lors de la création.')
    }
  }

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/dashboard/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Champs du formulaire */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="font-display font-semibold text-stone-800 mb-1">Champs du formulaire</h2>
        <p className="text-sm text-stone-400 mb-5">
          Activez les champs supplémentaires qui apparaîtront sur votre formulaire public.
        </p>

        <div className="space-y-4">
          <Toggle
            label="Prénom"
            description="Demander le prénom du répondant"
            checked={enableFirstName}
            onChange={(v) => setEnableFirstName(v)}
          />
          <Toggle
            label="Nom"
            description="Demander le nom du répondant"
            checked={enableLastName}
            onChange={(v) => setEnableLastName(v)}
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={saveFields}
            disabled={loading}
            className="bg-amber-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          {success && <span className="text-sm text-green-600">{success}</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      {/* Projets */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-display font-semibold text-stone-800">Projets</h2>
          <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
            {projects.length} / {projectLimit}
          </span>
        </div>
        <p className="text-sm text-stone-400 mb-5">
          Vos clients pourront choisir un projet lors de l'envoi de leur avis.
        </p>

        {/* Liste des projets */}
        {projects.length > 0 && (
          <ul className="space-y-2 mb-4">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3">
                <span className="text-sm text-stone-700 font-medium">{p.name}</span>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Ajouter un projet */}
        {projects.length < projectLimit && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value.slice(0, 80))}
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
              placeholder="Nom du projet (ex: The Last of Us)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
            />
            <button
              onClick={addProject}
              disabled={addingProject || !newProject.trim()}
              className="bg-stone-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-40"
            >
              {addingProject ? '...' : 'Ajouter'}
            </button>
          </div>
        )}

        {projects.length >= projectLimit && (
          <p className="text-sm text-stone-400 italic">
            Limite atteinte. Passez au plan supérieur pour ajouter plus de projets.
          </p>
        )}
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        <p className="text-xs text-stone-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-amber-500' : 'bg-stone-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
