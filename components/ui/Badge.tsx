type Variant = 'free' | 'pro' | 'default'

const variants: Record<Variant, string> = {
  free: 'bg-stone-100 text-stone-600',
  pro: 'bg-amber-100 text-amber-700',
  default: 'bg-stone-100 text-stone-600',
}

export default function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: Variant
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
