'use client'

import { Category } from '@/lib/types'

interface CategoryConfig {
  id: Category
  labels: Record<'en' | 'es' | 'fr', string>
  descriptions: Record<'en' | 'es' | 'fr', string>
  icon: string
  gradient: string
  border: string
  iconBg: string
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'tech',
    labels:       { en: 'Tech',       es: 'Tech',      fr: 'Tech' },
    descriptions: { en: 'Gadgets, software & platforms', es: 'Gadgets, software y plataformas', fr: 'Gadgets, logiciels & plateformes' },
    icon: '⚡',
    gradient: 'from-indigo-500/10 to-purple-500/10',
    border: 'border-indigo-500/20 hover:border-indigo-400/50',
    iconBg: 'bg-indigo-500/15',
  },
  {
    id: 'innovation',
    labels:       { en: 'Innovation', es: 'Innovación', fr: 'Innovation' },
    descriptions: { en: 'AI, science & breakthroughs', es: 'IA, ciencia y nuevas ideas', fr: 'IA, science et nouvelles idées' },
    icon: '🔬',
    gradient: 'from-cyan-500/10 to-teal-500/10',
    border: 'border-cyan-500/20 hover:border-cyan-400/50',
    iconBg: 'bg-cyan-500/15',
  },
  {
    id: 'business',
    labels:       { en: 'Business',   es: 'Business',  fr: 'Business' },
    descriptions: { en: 'Startups, VC & industry', es: 'Startups, inversión e industria', fr: 'Startups, capital & industrie' },
    icon: '📈',
    gradient: 'from-emerald-500/10 to-green-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/15',
  },
  {
    id: 'economy',
    labels:       { en: 'Economy',    es: 'Economía',  fr: 'Économie' },
    descriptions: { en: 'Markets, finance & macro', es: 'Mercados, finanzas y macro', fr: 'Marchés, finance et macro' },
    icon: '💹',
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    iconBg: 'bg-amber-500/15',
  },
]

interface Props {
  lang: 'en' | 'es' | 'fr'
  onSelect: (category: Category) => void
}

export default function CategoryPicker({ lang, onSelect }: Props) {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center py-8">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-white font-bold text-2xl mb-2">
          {lang === 'es' ? '¿Qué querés leer hoy?' : lang === 'fr' ? 'Que voulez-vous lire aujourd\'hui ?' : 'What do you want to read today?'}
        </h1>
        <p className="text-slate-500 text-sm">
          {lang === 'es' ? 'Elegí una categoría para empezar' : lang === 'fr' ? 'Choisissez une catégorie pour commencer' : 'Pick a category to get started'}
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.border} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left`}
          >
            {/* Icon */}
            <span className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${cat.iconBg}`}>
              {cat.icon}
            </span>

            {/* Text */}
            <div>
              <p className="text-white font-semibold text-base leading-tight">
                {cat.labels[lang]}
              </p>
              <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                {cat.descriptions[lang]}
              </p>
            </div>

            {/* Arrow */}
            <svg
              className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
