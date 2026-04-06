'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', slug: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: authError, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, slug: form.slug },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const slugPreview = form.slug
    ? `feedbak.app/f/${form.slug}`
    : 'feedbak.app/f/votre-nom'

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl text-stone-900">
            Feed<span className="text-amber-500">Bak</span>
          </Link>
          <p className="text-stone-500 text-sm mt-2">Créez votre compte — c'est gratuit</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Votre nom ou activité
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Marie Dupont — Photographe"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Votre lien de feedback
              </label>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition">
                <span className="pl-4 pr-2 text-sm text-stone-400 whitespace-nowrap">
                  /f/
                </span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  required
                  placeholder="marie-dupont"
                  className="flex-1 py-2.5 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none bg-transparent"
                />
              </div>
              <p className="text-xs text-stone-400 mt-1.5">{slugPreview}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="vous@exemple.fr"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="8 caractères minimum"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-amber-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
