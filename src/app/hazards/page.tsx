"use client"

import { AdminHeader } from "@/components/admin-header"
import { HazardMonitoringMap } from "@/components/hazards/hazard-monitoring-map"
import { useLanguage } from "@/components/language-provider"
import { AlertTriangle, Map as MapIcon, ShieldAlert } from "lucide-react"

export default function HazardsPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col h-full bg-background min-h-screen text-foreground">
      <AdminHeader />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                {t("hazards")}
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mt-2"></div>
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Identify and monitor critical danger zones across the transit network. 
                Associated routes will automatically receive real-time alerts when vehicles approach these zones.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-card text-card-foreground p-3 rounded-2xl shadow-sm border border-border shrink-0">
              <div className="flex flex-col items-end px-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Status</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 whitespace-nowrap">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  LIVE MONITORING
                </span>
              </div>
              <div className="h-10 w-[1px] bg-border"></div>
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <MapIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-[2rem] p-6 shadow-2xl border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-red-500 opacity-50"></div>
            <HazardMonitoringMap />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Dangerous Bends</h3>
                <p className="text-sm text-muted-foreground font-medium">Mark sharp curves and mountain passes that require reduced speed.</p>
              </div>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-3xl border border-border shadow-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Accident Prone</h3>
                <p className="text-sm text-muted-foreground font-medium">Historical high-risk areas identified through driver feedback and data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
