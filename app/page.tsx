"use client"

import { AppShell } from "@/components/layout/app-shell"
import { VerseOfDay } from "@/components/dashboard/verse-of-day"
import { ProgressRing } from "@/components/dashboard/progress-ring"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyChallenges } from "@/components/dashboard/daily-challenges"
import { PopularThemes } from "@/components/dashboard/popular-themes"
import { getCurrentSeason } from "@/lib/seasons"
import { useEffect, useMemo, useState } from "react"
import { Gift, Sun, Leaf, Cross, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getCompletedChaptersAction } from "@/actions/progress"
import { bibleBooks } from "@/lib/bible-data"

export default function HomePage() {
  const [season, setSeason] = useState(getCurrentSeason())
  const { user } = useAuth()
  const [completedByBook, setCompletedByBook] = useState<Map<string, Set<number>>>(new Map())

  // Icons mapping
  const Icons = {
    Gift, Sun, Leaf, Cross, Sparkles
  }
  const SeasonIcon = Icons[season.icon as keyof typeof Icons] || Sparkles

  useEffect(() => {
    setSeason(getCurrentSeason())
  }, [])

  const books = useMemo(() => {
    return [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user?.id) {
        setCompletedByBook(new Map())
        return
      }
      try {
        const res = await getCompletedChaptersAction(user.id)
        if (!res?.success || !res.data || cancelled) return
        const m = new Map<string, Set<number>>()
        for (const row of res.data as any[]) {
          if (!row?.bookId || !row?.chapter) continue
          const bookId = String(row.bookId)
          const chapter = Number(row.chapter)
          if (!Number.isFinite(chapter)) continue
          const set = m.get(bookId) || new Set<number>()
          set.add(chapter)
          m.set(bookId, set)
        }
        setCompletedByBook(m)
      } catch (e) {
        if (!cancelled) setCompletedByBook(new Map())
        console.error(e)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const bookProgress = useMemo(() => {
    return books.map((b) => {
      const completedSet = completedByBook.get(b.id)
      const completed = completedSet ? completedSet.size : 0
      const total = Math.max(1, b.capitulos)
      const pct = Math.max(0, Math.min(1, completed / total))
      return {
        bookId: b.id,
        bookName: b.nombre,
        totalChapters: total,
        completedChapters: completed,
        pct,
      }
    })
  }, [books, completedByBook])

  const totals = useMemo(() => {
    const totalChapters = bookProgress.reduce((acc, b) => acc + b.totalChapters, 0)
    const completedChapters = bookProgress.reduce((acc, b) => acc + b.completedChapters, 0)
    const completedBooks = bookProgress.reduce((acc, b) => acc + (b.pct >= 1 ? 1 : 0), 0)
    return {
      totalChapters,
      completedChapters,
      completedBooks,
      totalBooks: bookProgress.length,
    }
  }, [bookProgress])

  const chart = useMemo(() => {
    const w = 1000
    const h = 84
    const top = 10
    const bottom = 74
    const n = bookProgress.length
    if (n <= 0) {
      return {
        w,
        h,
        path: "" as string,
        points: [] as { x: number; y: number }[],
        progressRatio: 0,
        marker: null as { x: number; y: number } | null,
      }
    }
    const totalAllChapters = bookProgress.reduce((acc, b) => acc + b.totalChapters, 0)
    const completedAllChapters = bookProgress.reduce((acc, b) => acc + Math.min(b.completedChapters, b.totalChapters), 0)
    const progressRatio = totalAllChapters > 0 ? Math.max(0, Math.min(1, completedAllChapters / totalAllChapters)) : 0

    const points = bookProgress.map((_, i) => {
      const t = n === 1 ? 1 : i / (n - 1)
      const base = Math.pow(t, 0.9)
      const wiggle =
        Math.sin(t * Math.PI * 2.6) * 0.12 +
        Math.sin(t * Math.PI * 7.2 + 0.7) * 0.07 +
        Math.sin(t * Math.PI * 13.4 + 1.1) * 0.04
      let value = 0.14 + base * 0.78 + wiggle * (0.8 - base * 0.35)
      value = Math.max(0, Math.min(1, value))
      if (i === 0) value = Math.min(value, 0.2)
      if (i === n - 1) value = 1

      const x = n === 1 ? w / 2 : (i / (n - 1)) * w
      const y = bottom - value * (bottom - top)
      return { x, y }
    })

    const smoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return ""
      if (pts.length === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
      const tension = 0.18
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] || p2

        const cp1x = p1.x + (p2.x - p0.x) * tension
        const cp1y = p1.y + (p2.y - p0.y) * tension
        const cp2x = p2.x - (p3.x - p1.x) * tension
        const cp2y = p2.y - (p3.y - p1.y) * tension

        d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
      }
      return d
    }

    const path = smoothPath(points)
    const markerX = progressRatio * w
    const markerIdx = n === 1 ? 0 : progressRatio * (n - 1)
    const i0 = Math.max(0, Math.min(n - 1, Math.floor(markerIdx)))
    const i1 = Math.max(0, Math.min(n - 1, Math.ceil(markerIdx)))
    const p0 = points[i0]
    const p1 = points[i1]
    const frac = i1 === i0 ? 0 : (markerIdx - i0) / (i1 - i0)
    const markerY = p0 && p1 ? p0.y + (p1.y - p0.y) * frac : bottom

    return { w, h, path, points, progressRatio, marker: { x: markerX, y: markerY } }
  }, [bookProgress])

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
              {season.id !== 'default' && <span className="text-3xl">{season.emoji}</span>}
              {season.id === 'default' ? "Bienvenido de vuelta" : season.greeting}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
               {season.id === 'default' ? "Continúa tu viaje espiritual hoy" : `Celebrando: ${season.name}`}
               {season.id !== 'default' && (
                 <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary ${season.accentColor} bg-opacity-10 border border-border/50`}>
                    Temporada Especial
                 </span>
               )}
            </p>
          </div>
          {season.id !== 'default' && (
             <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-background to-secondary shadow-lg border border-border/50 ${season.accentColor}`}>
                <SeasonIcon className="w-6 h-6" />
             </div>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Versículo y acciones */}
          <div className="lg:col-span-2 space-y-6">
            <VerseOfDay />
            <QuickActions />
            <DailyChallenges />
          </div>

          {/* Columna derecha - Progreso */}
          <div className="space-y-6">
            <ProgressRing />
            <PopularThemes />
          </div>
        </div>

        <div className="mt-6 glass-card rounded-2xl border border-border/50 p-3 md:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-foreground">Progreso por libros</div>
            <div className="text-xs text-muted-foreground tabular-nums">{totals.completedBooks}/{totals.totalBooks}</div>
          </div>

          <div className="mt-2">
            <div className="text-[11px] text-muted-foreground tabular-nums">
              Capítulos: {totals.completedChapters}/{totals.totalChapters}
            </div>

            <div className="mt-2 w-full">
              <svg
                viewBox={`0 0 ${chart.w} ${chart.h}`}
                className="w-full h-[76px] overflow-visible"
                role="img"
                aria-label="Gráfica lineal de progreso por libros"
              >
                <defs>
                  <linearGradient id="progressLineDark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#020202" />
                    <stop offset="100%" stopColor="#2a2a2a" />
                  </linearGradient>
                  <clipPath id="progressClip">
                    <rect x="0" y="0" width={chart.progressRatio * chart.w} height={chart.h} />
                  </clipPath>
                  <filter id="progressLineGlowWhite" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.25" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d={chart.path}
                  fill="none"
                  stroke="url(#progressLineDark)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <path
                  d={chart.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                  filter="url(#progressLineGlowWhite)"
                  clipPath="url(#progressClip)"
                />

                {chart.marker ? (
                  <>
                    <circle
                      cx={chart.marker.x}
                      cy={chart.marker.y}
                      r="6.5"
                      fill="rgba(255,255,255,0.15)"
                      filter="url(#progressLineGlowWhite)"
                      clipPath="url(#progressClip)"
                    />
                    <circle
                      cx={chart.marker.x}
                      cy={chart.marker.y}
                      r="3.6"
                      fill="#ffffff"
                      clipPath="url(#progressClip)"
                    />
                  </>
                ) : null}

                <text x="0" y={chart.h - 2} fontSize="10" fill="currentColor" className="text-muted-foreground">
                  Génesis
                </text>
                <text x={chart.w} y={chart.h - 2} textAnchor="end" fontSize="10" fill="currentColor" className="text-muted-foreground">
                  Apocalipsis
                </text>
              </svg>
            </div>
          </div>
        </div>
        
      </div>
    </AppShell>
  )
}
