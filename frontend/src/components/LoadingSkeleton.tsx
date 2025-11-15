export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="relative h-24 w-full rounded-xl bg-zinc-800/50 border border-zinc-700/50 overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  )
}
