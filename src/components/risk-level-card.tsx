"use client"

import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getRiskLevelDetails } from "@/lib/safety-score"

interface RiskLevelCardProps {
  score: number
  trend?: string
  className?: string
}

export function RiskLevelCard({ score, trend = "-5.0%", className }: RiskLevelCardProps) {
  // Determine if trend is positive or negative
  const isPositive = trend.startsWith("+")
  const trendColor = isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
  const trendBg = isPositive ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-rose-100 dark:bg-rose-500/20"

  // Get dynamic details based on the score
  const { level, colorClass, barColor } = getRiskLevelDetails(score)
  
  // Risk percentage is the inverse of safety score
  const riskPercentage = Math.max(0, 100 - score)

  return (
    <div className={cn(
      "relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between w-full min-w-[280px] max-w-sm aspect-[5/4]",
      className
    )}>
      <div className="flex justify-between items-start">
        {/* Warning Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-orange-500 dark:text-orange-500 stroke-[2]" />
        </div>

        {/* Trend Indicator */}
        <div className={cn("px-3 py-1 rounded-full text-sm font-semibold", trendBg, trendColor)}>
          {trend}
        </div>
      </div>

      <div className="mt-6 mb-2">
        {/* Label */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-1">
          RISK_LEVEL
        </h3>
        
        {/* Risk Level String */}
        <div className={cn("text-5xl sm:text-6xl font-black tracking-tight", colorClass)}>
          {level}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-auto pt-4">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
            style={{ width: `${riskPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
