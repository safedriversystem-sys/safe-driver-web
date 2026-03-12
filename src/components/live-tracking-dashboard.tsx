"use client"

import { useState } from "react"
import { Search, MapPin, CloudSun, Map as MapIcon, Phone, AlertCircle, Play, Smartphone } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FleetMap } from "./fleet-map"
import type { Vehicle } from "@/lib/fleet-types"
import { useLanguage } from "@/components/language-provider"

interface LiveTrackingDashboardProps {
  vehicles: Vehicle[]
}

export function LiveTrackingDashboard({ vehicles }: LiveTrackingDashboardProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const activeVehicles = vehicles.filter((v) => v.status === "active")

  return (
    <div className="relative w-full h-[calc(100vh-220px)] rounded-xl overflow-hidden border border-neutral-200">
      {/* Base Map Layer */}
      <FleetMap
        vehicles={activeVehicles}
        selectedVehicle={selectedVehicle}
        onVehicleClick={setSelectedVehicle}
        className="w-full h-full"
      />

      {/* Top Left: Search & Filters Panel */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 w-full max-w-md">
        {/* Search Bar Glass Panel */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/40">
          <Search className="w-5 h-5 text-neutral-500 ml-3 shrink-0" />
          <Input
            placeholder="Search route 370 or Baddegama..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 shrink-0 h-10 w-10">
            <MapPin className="w-4 h-4" />
          </Button>
        </div>

        {/* Route Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
          {["370", "515", "574", "515/1", "339", "384", "363/4"].map((route) => (
            <button
              key={route}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50 text-sm font-medium whitespace-nowrap hover:bg-white transition-colors"
            >
              <BusIcon className="w-4 h-4 text-neutral-700" />
              {route}
            </button>
          ))}
        </div>
      </div>

      {/* Top Right: Info Panels */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4 w-72">

        {/* Stats Modules */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <BusIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Total Buses</p>
                <p className="text-xs text-neutral-500">Registered in system</p>
              </div>
            </div>
            <span className="text-2xl font-light">{vehicles.length}</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Active Routes</p>
                <p className="text-xs text-neutral-500">Available bus routes</p>
              </div>
            </div>
            <span className="text-2xl font-light">12</span>
          </div>
        </div>

      </div>

    </div>
  )
}

function BusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  )
}
