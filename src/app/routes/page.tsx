"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Route as RouteIcon,
  Bus,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  Loader2,
  Maximize2,
  BarChart3,
  Map as MapIcon,
  Plus,
  Trash2,
} from "lucide-react"
import type { Route, RouteStop } from "@/lib/route-types"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { motion, AnimatePresence } from "framer-motion"
import { ThreeDMap } from "@/components/3d-map"
import { Progress } from "@/components/ui/progress"

export default function RouteMonitoring() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    maintenance: 0,
    totalVehicles: 0,
    averageOnTimePerformance: 0,
    totalSafetyIncidents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  
  // Add Route state
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRoute, setNewRoute] = useState({
    name: "",
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    stops: [
      { name: "", time: "", order: 0 },
      { name: "", time: "", order: 1 }
    ]
  })

  // Fetch routes
  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/routes?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch routes")
      const data = await response.json()
      setRoutes(data)
    } catch (error) {
      console.error("Error fetching routes:", error)
      toast({
        title: "Error",
        description: "Failed to load routes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/routes/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    fetchRoutes()
    fetchStats()
  }, [])

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRoutes()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter])

  const handleAddRoute = async () => {
    // validate
    if (!newRoute.name || !newRoute.startPoint || !newRoute.endPoint || !newRoute.distance || !newRoute.estimatedTime) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    // validate stops
    const validStops = newRoute.stops.filter(s => s.name && s.time);
    if (validStops.length < 2) {
      toast({ title: "Error", description: "At least 2 stops with name and time are required", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: newRoute.name,
        startPoint: newRoute.startPoint,
        endPoint: newRoute.endPoint,
        distance: Number(newRoute.distance),
        estimatedTime: Number(newRoute.estimatedTime),
        stops: validStops.map((s, i) => ({ ...s, order: i }))
      };

      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create route");
      }

      toast({ title: "Success", description: "Route created successfully!" });
      setShowAddRoute(false);
      setNewRoute({
        name: "",
        startPoint: "",
        endPoint: "",
        distance: "",
        estimatedTime: "",
        stops: [
          { name: "", time: "", order: 0 },
          { name: "", time: "", order: 1 }
        ]
      });
      fetchRoutes();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filter is now handled server-side
  const filteredRoutes = routes

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-emerald-600"
    if (performance >= 80) return "text-amber-600"
    return "text-rose-600"
  }

  const getLoadColor = (load: number) => {
    if (load >= 90) return "text-rose-600"
    if (load >= 70) return "text-amber-600"
    return "text-emerald-600"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#fafafa] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight">
            {t("route_monitoring")}
          </h1>
          <p className="text-neutral-500 text-lg">{t("route_monitoring_desc")}</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-neutral-200">
          <Dialog open={showAddRoute} onOpenChange={setShowAddRoute}>
            <DialogTrigger asChild>
              <Button className="rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Bus Route</DialogTitle>
                <DialogDescription>Create a new route that will be available dynamically in the fleet management system.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Route Name <span className="text-red-500">*</span></Label>
                    <Input placeholder="e.g., Express Route 1" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Point <span className="text-red-500">*</span></Label>
                    <Input placeholder="e.g., Central Station" value={newRoute.startPoint} onChange={e => setNewRoute({...newRoute, startPoint: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Point <span className="text-red-500">*</span></Label>
                    <Input placeholder="e.g., North Terminal" value={newRoute.endPoint} onChange={e => setNewRoute({...newRoute, endPoint: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Distance (km) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="e.g., 25.5" value={newRoute.distance} onChange={e => setNewRoute({...newRoute, distance: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Time (mins) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="e.g., 45" value={newRoute.estimatedTime} onChange={e => setNewRoute({...newRoute, estimatedTime: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold">Route Stops</Label>
                    <Button variant="outline" size="sm" onClick={() => setNewRoute({...newRoute, stops: [...newRoute.stops, { name: "", time: "", order: newRoute.stops.length }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Stop
                    </Button>
                  </div>
                  <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    {newRoute.stops.map((stop, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="space-y-1 flex-1">
                          <Label className="text-xs">Stop Name</Label>
                          <Input placeholder="e.g., Main Street" value={stop.name} onChange={e => {
                            const newStops = [...newRoute.stops];
                            newStops[index].name = e.target.value;
                            setNewRoute({...newRoute, stops: newStops});
                          }} />
                        </div>
                        <div className="space-y-1 w-32">
                          <Label className="text-xs">Arrival Time</Label>
                          <Input placeholder="08:00 AM" value={stop.time} onChange={e => {
                            const newStops = [...newRoute.stops];
                            newStops[index].time = e.target.value;
                            setNewRoute({...newRoute, stops: newStops});
                          }} />
                        </div>
                        {newRoute.stops.length > 2 && (
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600 mb-0.5" onClick={() => {
                            const newStops = newRoute.stops.filter((_, i) => i !== index);
                            setNewRoute({...newRoute, stops: newStops});
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Create Route"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-lg font-bold"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="rounded-lg font-bold"
          >
            <MapIcon className="h-4 w-4 mr-2" />
            Live Map
          </Button>
        </div>
      </motion.div>

      {/* Route Statistics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            title: t("active_routes"),
            value: stats.active,
            context: t("routes_total_context", { total: stats.total }),
            icon: RouteIcon,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            title: t("vehicles_on_routes"),
            value: stats.totalVehicles,
            context: t("currently_operating"),
            icon: Bus,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            title: t("on_time_performance"),
            value: `${stats.averageOnTimePerformance}%`,
            context: t("avg_across_routes"),
            icon: Clock,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            title: t("safety_incidents"),
            value: stats.totalSafetyIncidents,
            context: t("this_week"),
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative bg-white">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${stat.bg.replace("bg-", "bg-opacity-100 bg-")}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-black ${stat.color} mb-1 tracking-tight`}>{stat.value}</div>
                <p className="text-sm text-neutral-400 font-semibold">{stat.context}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === "map" && (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 h-[600px] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-neutral-200"
          >
            <ThreeDMap />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <Card className="border-none shadow-sm bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder={t("search_routes")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-neutral-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl bg-white shadow-inner"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-56 h-12 border-neutral-200 rounded-2xl bg-white font-semibold">
                  <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-neutral-200 shadow-xl p-2">
                  <SelectItem value="all" className="rounded-xl">{t("all_routes")}</SelectItem>
                  <SelectItem value="active" className="rounded-xl">{t("active")}</SelectItem>
                  <SelectItem value="inactive" className="rounded-xl">{t("inactive")}</SelectItem>
                  <SelectItem value="maintenance" className="rounded-xl">{t("route_maintenance")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Routes Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[2rem] shadow-sm border border-neutral-100">
          <Loader2 className="h-20 w-20 text-blue-500 mb-8 animate-spin" />
          <h3 className="text-2xl font-black text-neutral-900 mb-2">{t("loading_routes")}</h3>
          <p className="text-neutral-500 font-medium text-lg">{t("wait_fetching")}</p>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[2rem] shadow-sm border border-neutral-100">
          <div className="p-10 bg-neutral-50 rounded-full mb-8 shadow-inner">
            <RouteIcon className="h-20 w-20 text-neutral-200" />
          </div>
          <h3 className="text-2xl font-black text-neutral-900 mb-2">{t("no_routes_found")}</h3>
          <p className="text-neutral-500 font-medium text-lg">{t("no_routes_match")}</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {filteredRoutes.map((route) => (
            <motion.div key={route.id} variants={itemVariants}>
              <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-none shadow-lg overflow-hidden bg-white rounded-[2rem] relative">
                <div className={`h-2.5 w-full ${route.status === "active" ? "bg-emerald-500" : "bg-neutral-300"}`} />
                <CardHeader className="pb-6 pt-8 px-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-3xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors tracking-tight">
                          {route.name}
                        </CardTitle>
                        <Badge
                          variant={route.status === "active" ? "success" : "secondary"}
                          className="rounded-full px-4 py-1.5 text-[11px] uppercase font-black tracking-widest shadow-sm"
                        >
                          {t(route.status as any)}
                        </Badge>
                      </div>
                      <CardDescription className="text-lg font-bold flex items-center gap-2 flex-wrap">
                        <span className="text-neutral-400 font-medium">From</span>
                        <span className="text-neutral-800 bg-neutral-100 px-3 py-1 rounded-lg">{route.startPoint}</span>
                        <span className="text-neutral-400 font-medium">to</span>
                        <span className="text-neutral-800 bg-neutral-100 px-3 py-1 rounded-lg">{route.endPoint}</span>
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-2xl hover:bg-blue-50 hover:text-blue-600 border-neutral-200 shadow-sm h-12 w-12 shrink-0">
                      <Maximize2 className="h-6 w-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pb-10 px-8">
                  {/* Route Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-neutral-50/80 p-6 rounded-[1.5rem] border border-neutral-100">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Distance</p>
                      <div className="flex items-center gap-1.5 font-black text-neutral-900 text-lg">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{route.distance} <span className="text-xs font-bold text-neutral-400">km</span></span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Est. Time</p>
                      <div className="flex items-center gap-1.5 font-black text-neutral-900 text-lg">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        <span>{route.estimatedTime} <span className="text-xs font-bold text-neutral-400">min</span></span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Buses</p>
                      <div className="flex items-center gap-1.5 font-black text-neutral-900 text-lg">
                        <Bus className="h-4 w-4 text-emerald-500" />
                        <span>{route.activeVehicles}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Stops</p>
                      <div className="flex items-center gap-1.5 font-black text-neutral-900 text-lg">
                        <Users className="h-4 w-4 text-amber-500" />
                        <span>{route.totalStops}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-neutral-500">
                        <span>On-Time Performance</span>
                        <span className={getPerformanceColor(route.onTimePerformance)}>{Math.round(route.onTimePerformance)}%</span>
                      </div>
                      <Progress value={route.onTimePerformance} className="h-3 bg-neutral-100 rounded-full" indicatorClassName={route.onTimePerformance >= 90 ? "bg-emerald-500" : "bg-amber-500"} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-neutral-500">
                        <span>Passenger Load</span>
                        <span className={getLoadColor(route.passengerLoad)}>{Math.round(route.passengerLoad)}%</span>
                      </div>
                      <Progress value={route.passengerLoad} className="h-3 bg-neutral-100 rounded-full" indicatorClassName={route.passengerLoad >= 90 ? "bg-rose-500" : "bg-emerald-500"} />
                    </div>
                    <div className="flex flex-col justify-end">
                       <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Avg Speed</p>
                       <div className="text-3xl font-black text-blue-600 leading-none tabular-nums tracking-tighter">{Math.round(route.averageSpeed)} <span className="text-sm font-bold text-neutral-400 tracking-normal">km/h</span></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-100">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-neutral-200 h-14 px-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-black text-sm uppercase tracking-wider"
                      onClick={() => setSelectedRoute(route)}
                    >
                      <Eye className="h-5 w-5 mr-3" />
                      {t("view_details")}
                    </Button>
                    <Button className="rounded-2xl bg-neutral-900 h-14 px-8 hover:bg-blue-600 transition-all font-black text-sm uppercase tracking-wider text-white shadow-xl shadow-neutral-200 grow">
                      <Navigation className="h-5 w-5 mr-3 animate-pulse" />
                      {t("track_live")}
                    </Button>
                    <Button variant="ghost" className="rounded-2xl h-14 px-6 text-neutral-500 font-black text-sm uppercase tracking-wider hover:text-blue-600 hover:bg-blue-50">
                      <Activity className="h-5 w-5 mr-3" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Route Performance Analytics */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pb-2 pt-8 px-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">{t("performance_trends")}</CardTitle>
            </div>
            <CardDescription className="text-base font-bold text-neutral-400 ml-12">{t("performance_weekly")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {routes.length > 0 ? routes.map((route) => (
              <div key={route.id} className="flex justify-between items-center p-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${route.onTimePerformance >= 90 ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span className="font-bold text-neutral-700">{route.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {route.onTimePerformance >= 90 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-500" />
                  )}
                  <span className={`text-lg font-black tabular-nums ${getPerformanceColor(route.onTimePerformance)}`}>
                    {Math.round(route.onTimePerformance)}%
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-neutral-400 font-bold italic">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pb-2 pt-8 px-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">{t("passenger_load")}</CardTitle>
            </div>
            <CardDescription className="text-base font-bold text-neutral-400 ml-12">{t("capacity_utilization")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {routes.length > 0 ? routes.map((route) => (
              <div key={route.id} className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-neutral-700 uppercase tracking-tighter">{route.name}</span>
                  <span className={`font-black tabular-nums text-lg ${getLoadColor(route.passengerLoad)}`}>
                    {Math.round(route.passengerLoad)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-4 p-1 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${route.passengerLoad}%` }}
                    className={`h-full rounded-full shadow-sm ${route.passengerLoad >= 90
                      ? "bg-gradient-to-r from-rose-500 to-rose-400"
                      : route.passengerLoad >= 70
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      }`}
                  ></motion.div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-neutral-400 font-bold italic">No data available</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Route Details Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-10 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h2 className="text-4xl font-black tracking-tight text-neutral-900">{selectedRoute.name}</h2>
                      <Badge className="bg-emerald-500 text-white font-black px-4 py-1.5 uppercase tracking-widest text-[11px] rounded-full">Active</Badge>
                    </div>
                    <p className="text-xl font-bold text-neutral-400">
                      {selectedRoute.startPoint} <span className="mx-2 text-neutral-200">→</span> {selectedRoute.endPoint}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-neutral-100" onClick={() => setSelectedRoute(null)}>
                    <span className="text-2xl font-black text-neutral-400 hover:text-neutral-900">✕</span>
                  </Button>
                </div>

                {/* Route Progress */}
                <div className="mb-12 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 shadow-inner">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Activity className="h-6 w-6 text-blue-500" />
                    {t("current_progress")}
                  </h3>
                  <div className="relative space-y-8 pl-4">
                    <div className="absolute left-[21px] top-2 bottom-2 w-1.5 bg-neutral-200 rounded-full" />
                    {selectedRoute.stops.map((stop: RouteStop, index: number) => (
                      <div key={index} className="flex items-center gap-6 relative group">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-4 h-4 rounded-full border-4 border-white shadow-md z-10 ring-4 ${stop.status === "completed"
                            ? "bg-emerald-500 ring-emerald-50"
                            : stop.status === "current"
                              ? "bg-blue-500 ring-blue-50"
                              : "bg-neutral-300 ring-neutral-50"
                            }`}
                        ></motion.div>
                        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 group-hover:border-blue-200 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className={`text-lg font-black ${stop.status === "current" ? "text-blue-600" : "text-neutral-700"}`}>
                              {stop.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-neutral-400 tabular-nums">{stop.time}</span>
                              {stop.status === "completed" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                              {stop.status === "current" && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Activity className="h-5 w-5 text-blue-500" /></motion.div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: t("distance_km"), value: selectedRoute.distance, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: t("est_time_min"), value: selectedRoute.estimatedTime, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: t("active_vehicles_label"), value: selectedRoute.activeVehicles, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: t("avg_speed"), value: Math.round(selectedRoute.averageSpeed), color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((item, idx) => (
                    <div key={idx} className={`${item.bg} p-6 rounded-[1.5rem] border border-white shadow-sm text-center`}>
                      <div className={`text-4xl font-black ${item.color} mb-1 tabular-nums`}>{item.value}</div>
                      <div className="text-xs font-black text-neutral-400 uppercase tracking-widest leading-tight">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Assigned Buses */}
                <div className="mt-8 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 shadow-inner">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <Bus className="h-6 w-6 text-emerald-500" />
                    Assigned Buses
                  </h3>
                  {selectedRoute.vehicles && selectedRoute.vehicles.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {selectedRoute.vehicles.map((vehicleId: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm transition-transform hover:-translate-y-1">
                          <Bus className="h-5 w-5 text-neutral-400" />
                          <span className="font-black text-lg text-neutral-800">{vehicleId}</span>
                          <Badge className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full">On Route</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-neutral-400 font-bold">
                      No buses currently assigned to this route.
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8 bg-neutral-50 border-t border-neutral-100 flex gap-4">
                 <Button className="rounded-2xl bg-neutral-900 h-14 px-10 font-black text-white hover:bg-blue-600 transition-all shadow-xl shadow-neutral-200 grow uppercase tracking-wider">
                    Track Live on Map
                 </Button>
                 <Button variant="outline" className="rounded-2xl border-neutral-200 h-14 px-10 font-black hover:bg-neutral-100 transition-all uppercase tracking-wider">
                    Full Analytics
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
