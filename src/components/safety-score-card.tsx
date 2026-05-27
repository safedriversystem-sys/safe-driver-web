"use client"

import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafetyScoreCardProps {
  score: number
  trend?: string
  className?: string
}

export function SafetyScoreCard({ score, trend = "+0.0%", className }: SafetyScoreCardProps) {
  // Determine if trend is positive or negative
  const isPositive = trend.startsWith("+")
  const trendColor = isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
  const trendBg = isPositive ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-rose-100 dark:bg-rose-500/20"

  // Determine progress bar color based on score (green if > 90, yellow if > 70, else red. BUT the screenshot uses a blue bar, so let's use blue to match exactly, or make it dynamic. The screenshot shows a solid blue bar. Let's use blue to match the visual)
  const barColor = "bg-blue-600" 

  return (
    <div className={cn(
      "relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between w-full min-w-[280px] max-w-sm aspect-[5/4]",
      className
    )}>
      <div className="flex justify-between items-start">
        {/* Shield Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-500 stroke-[2]" />
        </div>

        {/* Trend Indicator */}
        <div className={cn("px-3 py-1 rounded-full text-sm font-semibold", trendBg, trendColor)}>
          {trend}
        </div>
      </div>

      <div className="mt-6 mb-2">
        {/* Label */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-1">
          OVERALL_SAFETY_SCORE
        </h3>
        
        {/* Score Number */}
        <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {Number.isInteger(score) ? score : score.toFixed(1)}%
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-auto pt-4">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
