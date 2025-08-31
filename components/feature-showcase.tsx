"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Feature = {
  id: number
  title: string
  body: string
  image: string
}

const FEATURES: Feature[] = [
  {
    id: 1,
    title: "Smart Inbox",
    body: "Automatically prioritizes important conversations so you focus on what matters first.",
    image: "/smart-inbox-screen.png",
  },
  {
    id: 2,
    title: "One‑Tap Actions",
    body: "Archive, snooze, or delegate messages with a single tap to keep your inbox clean.",
    image: "/one-tap-actions-screen.png",
  },
  {
    id: 3,
    title: "AI Summaries",
    body: "Get concise summaries of long threads so you can catch up in seconds, not minutes.",
    image: "/ai-summaries-screen.png",
  },
  {
    id: 4,
    title: "Schedule Send",
    body: "Compose now and send later across time zones, so every message lands at the right time.",
    image: "/schedule-send-screen.png",
  },
  {
    id: 5,
    title: "Smart Templates",
    body: "Personalized, reusable snippets that adapt tone and context automatically.",
    image: "/smart-templates-screen.png",
  },
]

// Colors used (4 total): primary blue (#2563eb), white (#ffffff), gray-900 (#111827), gray-500 (#6b7280)

export function FeatureShowcase({
  className,
  features = FEATURES,
}: {
  className?: string
  features?: Feature[]
}) {
  const sectionRef = React.useRef<HTMLDivElement | null>(null)
  const [active, setActive] = React.useState(0) // index
  const total = features.length

  // Cache section metrics for scroll computations
  const metricsRef = React.useRef({
    startY: 0,
    endY: 0,
    height: 0,
    viewport: 0,
  })

  const computeMetrics = React.useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY || window.pageYOffset
    const startY = el.offsetTop
    const viewport = window.innerHeight
    const height = el.offsetHeight
    const endY = startY + height - viewport
    metricsRef.current = { startY, endY, height, viewport }
  }, [])

  const scrollToIndex = React.useCallback(
    (nextIndex: number) => {
      const i = Math.max(0, Math.min(total - 1, nextIndex))
      setActive(i)
      // Smoothly align scroll position to the corresponding step
      const { startY, endY } = metricsRef.current
      if (endY <= startY) return
      const t = total > 1 ? i / (total - 1) : 0
      const target = startY + t * (endY - startY)
      window.scrollTo({ top: target, behavior: "smooth" })
    },
    [total],
  )

  // Scroll listener: auto-advance feature index while section is in view (sticky)
  React.useEffect(() => {
    computeMetrics()

    let ticking = false
    const onScroll = () => {
      if (!sectionRef.current) return
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const { startY, endY } = metricsRef.current
        const y = window.scrollY || window.pageYOffset

        // Only auto-advance when within the sticky scroll range
        if (y >= startY && y <= endY && endY > startY) {
          const progress = (y - startY) / (endY - startY) // 0..1
          const next = Math.round(progress * (total - 1))
          if (next !== active) {
            setActive(next)
          }
        }
        ticking = false
      })
    }

    const onResize = () => {
      computeMetrics()
      // Re-sync scroll-based index after resize
      onScroll()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    // Initial sync
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [active, total, computeMetrics])

  const onPrev = () => scrollToIndex(active - 1)
  const onNext = () => scrollToIndex(active + 1)

  const current = features[active]

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full", className)}
      style={{ height: `${Math.max(1, total) * 100}vh` }}
      aria-label="Feature Showcase"
    >
      <div className="sticky top-0 h-screen">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-3 md:gap-12">
          {/* LEFT: label + heading + bullets + arrows */}
          <div className="flex h-full flex-col justify-center">
            {/* small blue label like `Feature No. X -` */}
            <p className="text-sm font-medium text-[#2563eb]">{`Feature No.${active + 1} -`}</p>

            {/* uppercase heading (use current.title) */}
            <h2 className="mt-3 text-pretty text-xl font-extrabold uppercase tracking-wide text-[#111827] md:text-2xl lg:text-3xl">
              {current.title}
            </h2>

            {/* concise feature description below the heading */}
            <p className="mt-3 max-w-prose text-[#6b7280]">{current.body}</p>

            {/* bullet list (first bullet from feature body) */}
            <ul className="mt-6 space-y-2 text-[#6b7280]">
              <li className="list-inside list-disc">{current.body}</li>
              <li className="list-inside list-disc">
                Ut enim minim: veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.
              </li>
              <li className="list-inside list-disc">
                Sed ut perspiciatis: unde omnis iste natus error sit voluptatem accusantium.
              </li>
              <li className="list-inside list-disc">
                Excepteur sint occaecat: cupidatat non proident sunt in culpa officia deserunt mollit.
              </li>
            </ul>

            {/* arrows row with a slim blue vertical bar in center */}
            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                aria-label="Previous feature"
                onClick={onPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#111827] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2563eb] md:h-11 md:w-11"
              >
                <span aria-hidden="true">←</span>
              </button>

              {/* slim blue vertical bar */}
              <span aria-hidden="true" className="h-10 w-[2px] rounded bg-[#2563eb]" />

              <button
                type="button"
                aria-label="Next feature"
                onClick={onNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#111827] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2563eb] md:h-11 md:w-11"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* CENTER: iPhone mockup */}
          <div className="mx-auto my-12 w-full max-w-[12rem] sm:my-16 sm:max-w-[14rem] md:my-20 md:max-w-[16rem] lg:my-20 lg:max-w-[18rem]">
            <div
              className={cn(
                // metallic frame
                "relative w-full overflow-visible rounded-[2.25rem] bg-gradient-to-b from-neutral-200 to-neutral-400 p-1",
                // soft shadow around device
                "shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
              )}
              aria-label="Feature phone preview"
            >
              {/* inner bezel with correct phone aspect */}
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] bg-black ring-1 ring-black/60">
                {/* notch */}
                <div
                  className="absolute left-1/2 top-0 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:h-6 md:w-28"
                  aria-hidden="true"
                >
                  {/* speaker */}
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded bg-neutral-800 md:w-16" />
                  {/* camera */}
                  <span className="absolute right-5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-neutral-900 ring-2 ring-neutral-700 md:right-6" />
                </div>

                {/* screen area (expose bezel via margin) */}
                <div className="absolute inset-0 m-2 overflow-hidden rounded-[1.6rem]">
                  <div
                    className="h-full w-full rounded-[1.6rem] bg-gradient-to-br from-[#ff4d67] via-[#b44bff] to-[#4f46e5]"
                    aria-hidden="true"
                  />
                </div>

                {/* subtle glass + ring */}
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-black/30" />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent" />
              </div>
            </div>
          </div>

          {/* RIGHT: heading + clickable feature list with active blue indicator bar */}
          <div className="w-full">
            <h3 className="mb-4 text-lg font-semibold text-[#111827]">Feature Showcase</h3>
            <ol className="relative space-y-3 pl-4">
              {features.map((f, i) => {
                const isActive = i === active
                return (
                  <li key={f.id} className="relative">
                    {/* blue indicator bar on the left for active item */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-4 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded bg-transparent",
                        isActive && "bg-[#2563eb]",
                      )}
                    />
                    <button
                      type="button"
                      aria-label={`Show feature ${f.title}`}
                      aria-pressed={isActive}
                      onClick={() => scrollToIndex(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors",
                        "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2563eb]",
                      )}
                    >
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm md:text-base",
                            isActive ? "font-semibold text-[#111827]" : "text-[#6b7280]",
                          )}
                        >
                          {`Feature ${f.id} : ${f.title}`}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase
