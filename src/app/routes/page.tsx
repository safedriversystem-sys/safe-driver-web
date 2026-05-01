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
import type { Route, RouteStop, HazardZone } from "@/lib/route-types"
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
  })
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [focusedHazard, setFocusedHazard] = useState<HazardZone | null>(null)
  
  // Add Route state
  const [showAddRoute, setShowAddRoute] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRoute, setNewRoute] = useState({
    name: "",
    busNumber: "",
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    stops: [
      { name: "", time: "", order: 0 },
      { name: "", time: "", order: 1 }
    ],
    hazardZones: [] as HazardZone[]
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

  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  const handleSaveRoute = async () => {
    // validate
    if (!newRoute.name || !newRoute.startPoint || !newRoute.endPoint || !newRoute.distance || !newRoute.estimatedTime) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    // validate stops
    const validStops = newRoute.stops.filter(s => s.name);
    if (validStops.length < 2) {
      toast({ title: "Error", description: "At least 2 stops with a name are required", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: newRoute.name,
        busNumber: newRoute.busNumber,
        startPoint: newRoute.startPoint,
        endPoint: newRoute.endPoint,
        distance: Number(newRoute.distance),
        estimatedTime: Number(newRoute.estimatedTime),
        stops: validStops.map((s, i) => ({ ...s, order: i })),
        hazardZones: ((newRoute as any).hazardZones || []).map((hz: any) => ({
          ...hz,
          latitude: Number(hz.latitude),
          longitude: Number(hz.longitude)
        }))
      };

      const url = editingRouteId ? `/api/routes/${editingRouteId}` : "/api/routes";
      const method = editingRouteId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Failed to ${editingRouteId ? "update" : "create"} route`);
      }

      toast({ title: "Success", description: `Route ${editingRouteId ? "updated" : "created"} successfully!` });
      setShowAddRoute(false);
      setEditingRouteId(null);
      setNewRoute({
        name: "",
        startPoint: "",
        endPoint: "",
        distance: "",
        estimatedTime: "",
        stops: [
          { name: "", time: "", order: 0 },
          { name: "", time: "", order: 1 }
        ],
        hazardZones: [] as HazardZone[]
      });
      fetchRoutes();
      if (selectedRoute && editingRouteId === selectedRoute.id) {
         setSelectedRoute(null);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteRoute = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      const response = await fetch(`/api/routes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete route");
      toast({ title: "Success", description: "Route deleted successfully!" });
      fetchRoutes();
      if (selectedRoute?.id === id) setSelectedRoute(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
          <Dialog open={showAddRoute} onOpenChange={(open) => {
            setShowAddRoute(open);
            if (!open) {
              setEditingRouteId(null);
              setNewRoute({
                name: "", busNumber: "", startPoint: "", endPoint: "", distance: "", estimatedTime: "",
                stops: [{ name: "", time: "", order: 0 }, { name: "", time: "", order: 1 }],
                hazardZones: [] as HazardZone[]
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => {
                setEditingRouteId(null);
                setNewRoute({
                  name: "", busNumber: "", startPoint: "", endPoint: "", distance: "", estimatedTime: "",
                  stops: [{ name: "", time: "", order: 0 }, { name: "", time: "", order: 1 }],
                  hazardZones: [] as HazardZone[]
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRouteId ? "Edit Bus Route" : "Add New Bus Route"}</DialogTitle>
                <DialogDescription>{editingRouteId ? "Update route details." : "Create a new route that will be available dynamically in the fleet management system."}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Route Name <span className="text-red-500">*</span></Label>
                    <Input placeholder="e.g., Express Route 1" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bus Number (Route No)</Label>
                    <Input placeholder="e.g., 240" value={newRoute.busNumber} onChange={e => setNewRoute({...newRoute, busNumber: e.target.value})} />
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

                {/* Hazard Zones Section */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Label className="text-base font-bold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                        Hazard Zones <span className="text-neutral-400 font-normal text-xs ml-1">(Optional)</span>
                      </Label>
                      <p className="text-xs text-neutral-400">Add schools or dangerous areas along the route.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setNewRoute({
                        ...newRoute, 
                        hazardZones: [...(newRoute as any).hazardZones, { name: "", location: "", latitude: 0, longitude: 0 }]
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Hazard
                    </Button>
                  </div>
                  
                  {((newRoute as any).hazardZones || []).length > 0 && (
                    <div className="space-y-4 bg-rose-50/30 p-4 rounded-xl border border-rose-100">
                      {((newRoute as any).hazardZones).map((hz: any, index: number) => (
                        <div key={index} className="space-y-3 p-4 bg-white rounded-xl border border-rose-100 shadow-sm relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8 text-neutral-400 hover:text-rose-500 rounded-full"
                            onClick={() => {
                              const newHZs = (newRoute as any).hazardZones.filter((_: any, i: number) => i !== index);
                              setNewRoute({...newRoute, hazardZones: newHZs});
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-neutral-400">School / Zone Name</Label>
                              <Input 
                                placeholder="e.g., Lyceum International" 
                                value={hz.name} 
                                className="h-9 text-sm"
                                onChange={e => {
                                  const newHZs = [...(newRoute as any).hazardZones];
                                  newHZs[index].name = e.target.value;
                                  setNewRoute({...newRoute, hazardZones: newHZs});
                                }} 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-neutral-400">Area / Location</Label>
                              <Input 
                                placeholder="e.g., Wattala" 
                                value={hz.location} 
                                className="h-9 text-sm"
                                onChange={e => {
                                  const newHZs = [...(newRoute as any).hazardZones];
                                  newHZs[index].location = e.target.value;
                                  setNewRoute({...newRoute, hazardZones: newHZs});
                                }} 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-neutral-400">Latitude</Label>
                              <Input 
                                type="number" 
                                step="any"
                                placeholder="6.9853" 
                                value={hz.latitude} 
                                className="h-9 text-sm font-mono"
                                onChange={e => {
                                  const newHZs = [...(newRoute as any).hazardZones];
                                  newHZs[index].latitude = e.target.value;
                                  setNewRoute({...newRoute, hazardZones: newHZs});
                                }} 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-neutral-400">Longitude</Label>
                              <Input 
                                type="number" 
                                step="any"
                                placeholder="79.8865" 
                                value={hz.longitude} 
                                className="h-9 text-sm font-mono"
                                onChange={e => {
                                  const newHZs = [...(newRoute as any).hazardZones];
                                  newHZs[index].longitude = e.target.value;
                                  setNewRoute({...newRoute, hazardZones: newHZs});
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleSaveRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : (editingRouteId ? "Update Route" : "Create Route")}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8"
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
                          {route.name}{route.busNumber ? ` - ${route.busNumber}` : ""}
                        </CardTitle>
                        <Badge
                          variant={route.status === "active" ? "success" : "secondary"}
                          className="rounded-full px-4 py-1.5 text-[11px] uppercase font-black tracking-widest shadow-sm"
                        >
                          {t(route.status as any)}
                        </Badge>
                      </div>

                    </div>
                    <Button variant="outline" size="icon" className="rounded-2xl hover:bg-blue-50 hover:text-blue-600 border-neutral-200 shadow-sm h-12 w-12 shrink-0">
                      <Maximize2 className="h-6 w-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pb-10 px-8">
                  {/* Route Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-neutral-50/80 p-6 rounded-[1.5rem] border border-neutral-100">
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
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Hazards</p>
                      <div className="flex items-center gap-1.5 font-black text-neutral-900 text-lg">
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                        <span>{route.hazardZones?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Buses Section */}
                  <div className="mt-2 bg-neutral-50 p-4 sm:p-6 rounded-[1.5rem] border border-neutral-100 shadow-inner">
                    <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                      <Bus className="h-5 w-5 text-emerald-500" />
                      Assigned Buses
                    </h3>
                    {route.vehicles && route.vehicles.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {route.vehicles.map((vehicleId: string, idx: number) => (
                          <Dialog key={idx}>
                            <DialogTrigger asChild>
                              <button className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-neutral-200 shadow-sm transition-transform hover:-translate-y-1 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <Bus className="h-4 w-4 text-neutral-400" />
                                <span className="font-black text-sm text-neutral-800">{vehicleId}</span>
                                <Badge className="ml-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] pointer-events-none">On Route</Badge>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3 text-2xl font-black">
                                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                                    <Bus className="h-6 w-6" />
                                  </div>
                                  Bus {vehicleId}
                                </DialogTitle>
                                <DialogDescription className="font-medium text-neutral-500">
                                  Live tracking and metrics for this bus on {route.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="col-span-2 bg-emerald-50 p-5 rounded-[1.5rem] border border-emerald-100">
                                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                                  <p className="text-2xl font-black text-emerald-700 mt-1">Active</p>
                                </div>
                                <div className="col-span-2 bg-neutral-50 p-5 rounded-[1.5rem] border border-neutral-100">
                                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Current Location</p>
                                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                    <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                                      <MapPin className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-neutral-700">En route to next stop</span>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2">
                                <Button className="w-full h-12 rounded-2xl bg-neutral-900 text-white font-bold hover:bg-neutral-800">
                                  View Full Tracking
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-neutral-400 font-bold text-sm">
                        No buses currently assigned.
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-100">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-neutral-200 h-14 px-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-black text-sm uppercase tracking-wider"
                      onClick={() => setSelectedRoute(route)}
                    >
                      <MapPin className="h-5 w-5 mr-3" />
                      View Map
                    </Button>

                    <Button variant="ghost" className="rounded-2xl h-14 px-6 text-neutral-500 font-black text-sm uppercase tracking-wider hover:text-blue-600 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRouteId(route.id);
                        setNewRoute({
                          name: route.name, busNumber: route.busNumber || "", startPoint: route.startPoint, endPoint: route.endPoint,
                          distance: route.distance.toString(), estimatedTime: route.estimatedTime.toString(),
                          stops: route.stops && route.stops.length > 0 ? route.stops.map((s: any) => ({ ...s, time: s.time || "" })) : [{ name: "", time: "", order: 0 }, { name: "", time: "", order: 1 }],
                          hazardZones: route.hazardZones || []
                        });
                        setShowAddRoute(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" className="rounded-2xl h-14 px-6 text-rose-500 font-black text-sm uppercase tracking-wider hover:text-rose-600 hover:bg-rose-50"
                      onClick={(e) => handleDeleteRoute(route.id, e)}
                    >
                      <Trash2 className="h-5 w-5 mr-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}



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
                      <h2 className="text-4xl font-black tracking-tight text-neutral-900">{selectedRoute.name}{selectedRoute.busNumber ? ` - ${selectedRoute.busNumber}` : ""}</h2>
                      <Badge className="bg-emerald-500 text-white font-black px-4 py-1.5 uppercase tracking-widest text-[11px] rounded-full">Active</Badge>
                    </div>
                    {focusedHazard && (
                      <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <Badge className="bg-rose-100 text-rose-600 border-rose-200 px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Viewing: {focusedHazard.name}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-neutral-400 hover:text-neutral-900 font-bold"
                          onClick={() => setFocusedHazard(null)}
                        >
                          Show Full Route
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 hover:bg-neutral-100" onClick={() => { setSelectedRoute(null); setFocusedHazard(null); }}>
                    <span className="text-2xl font-black text-neutral-400 hover:text-neutral-900">✕</span>
                  </Button>
                </div>

                {/* Embedded Route Map */}
                <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 mt-6 relative shadow-inner">
                  {/* Google Maps iFrame */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen 
                    key={focusedHazard ? focusedHazard.name : "full-route"}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={focusedHazard 
                      ? `https://maps.google.com/maps?q=${focusedHazard.latitude},${focusedHazard.longitude}&z=17&output=embed`
                      : `https://maps.google.com/maps?saddr=${encodeURIComponent(selectedRoute.startPoint)}&daddr=${encodeURIComponent(selectedRoute.endPoint)}&output=embed`
                    }
                  ></iframe>
                </div>

                {/* Hazard Zones Table */}
                {selectedRoute.hazardZones && selectedRoute.hazardZones.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-rose-500" />
                      Hazard Zones Along the Route
                    </h3>
                    <div className="bg-white border border-neutral-200 rounded-[2rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="py-4 px-6 text-xs font-black text-neutral-400 uppercase tracking-widest">School Name</th>
                            <th className="py-4 px-6 text-xs font-black text-neutral-400 uppercase tracking-widest">Location (Area)</th>
                            <th className="py-4 px-6 text-xs font-black text-neutral-400 uppercase tracking-widest hidden sm:table-cell">Coordinates (Lat, Lon)</th>
                            <th className="py-4 px-6 text-xs font-black text-neutral-400 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRoute.hazardZones.map((zone, idx) => (
                            <tr key={idx} className={`border-b border-neutral-100 last:border-0 transition-colors ${focusedHazard?.name === zone.name ? "bg-rose-50" : "hover:bg-neutral-50/50"}`}>
                              <td className="py-4 px-6 font-bold text-neutral-900">{zone.name}</td>
                              <td className="py-4 px-6 font-medium text-neutral-500">{zone.location}</td>
                              <td className="py-4 px-6 font-medium text-neutral-500 font-mono text-sm hidden sm:table-cell">{zone.latitude}, {zone.longitude}</td>
                              <td className="py-4 px-6 text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={`rounded-xl font-bold h-9 px-4 ${focusedHazard?.name === zone.name ? "bg-rose-500 text-white border-rose-500" : "text-neutral-600"}`}
                                  onClick={() => setFocusedHazard(zone)}
                                >
                                  <MapIcon className="h-4 w-4 mr-2" />
                                  View on Map
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 bg-neutral-50 border-t border-neutral-100 flex gap-4">

                 <Button variant="outline" className="rounded-2xl border-rose-200 text-rose-500 h-14 px-10 font-black hover:bg-rose-50 hover:text-rose-600 transition-all uppercase tracking-wider" onClick={() => handleDeleteRoute(selectedRoute.id)}>
                    <Trash2 className="h-5 w-5 mr-3 inline-block" />
                    Delete Route
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
