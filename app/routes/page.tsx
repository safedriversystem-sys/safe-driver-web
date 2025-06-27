"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Route,
  Bus,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
} from "lucide-react"

// Mock route data
const mockRoutes = [
  {
    id: "RT001",
    name: "Colombo - Kandy Express",
    startPoint: "Colombo Fort",
    endPoint: "Kandy Central",
    distance: 115,
    estimatedTime: 180,
    activeVehicles: 3,
    totalStops: 12,
    status: "active",
    onTimePerformance: 92,
    averageSpeed: 38,
    passengerLoad: 85,
    safetyIncidents: 2,
    vehicles: ["NB-1234", "NB-5678", "NB-9012"],
    stops: [
      { name: "Colombo Fort", time: "06:00", status: "completed" },
      { name: "Kadawatha", time: "06:25", status: "completed" },
      { name: "Gampaha", time: "06:45", status: "current" },
      { name: "Veyangoda", time: "07:05", status: "upcoming" },
      { name: "Kandy Central", time: "09:00", status: "upcoming" },
    ],
  },
  {
    id: "RT002",
    name: "Galle - Matara Coastal",
    startPoint: "Galle Bus Stand",
    endPoint: "Matara Central",
    distance: 45,
    estimatedTime: 75,
    activeVehicles: 2,
    totalStops: 8,
    status: "active",
    onTimePerformance: 88,
    averageSpeed: 36,
    passengerLoad: 70,
    safetyIncidents: 1,
    vehicles: ["WP-5678", "WP-3456"],
    stops: [
      { name: "Galle Bus Stand", time: "07:00", status: "completed" },
      { name: "Hikkaduwa", time: "07:20", status: "completed" },
      { name: "Ambalangoda", time: "07:40", status: "current" },
      { name: "Matara Central", time: "08:15", status: "upcoming" },
    ],
  },
  {
    id: "RT003",
    name: "Negombo - Colombo Airport",
    startPoint: "Negombo Bus Stand",
    endPoint: "Bandaranaike Airport",
    distance: 25,
    estimatedTime: 45,
    activeVehicles: 4,
    totalStops: 6,
    status: "active",
    onTimePerformance: 95,
    averageSpeed: 33,
    passengerLoad: 92,
    safetyIncidents: 0,
    vehicles: ["CP-9012", "CP-3456", "CP-7890", "CP-2345"],
    stops: [
      { name: "Negombo Bus Stand", time: "05:30", status: "completed" },
      { name: "Ja-Ela", time: "05:45", status: "completed" },
      { name: "Seeduwa", time: "06:00", status: "current" },
      { name: "Bandaranaike Airport", time: "06:15", status: "upcoming" },
    ],
  },
]

export default function RouteMonitoring() {
  const [routes, setRoutes] = useState(mockRoutes)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes((prev) =>
        prev.map((route) => ({
          ...route,
          onTimePerformance: Math.max(80, Math.min(100, route.onTimePerformance + (Math.random() - 0.5) * 2)),
          passengerLoad: Math.max(40, Math.min(100, route.passengerLoad + (Math.random() - 0.5) * 5)),
          averageSpeed: Math.max(25, Math.min(50, route.averageSpeed + (Math.random() - 0.5) * 3)),
        })),
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || route.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600"
    if (performance >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getLoadColor = (load: number) => {
    if (load >= 90) return "text-red-600"
    if (load >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Route Monitoring System</h1>
        <p className="text-neutral-600">Real-time tracking and management of bus routes</p>
      </div>

      {/* Route Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{routes.filter((r) => r.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Out of {routes.length} total routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles on Routes</CardTitle>
            <Bus className="h-4 w-4 text-tech-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tech-600">
              {routes.reduce((acc, route) => acc + route.activeVehicles, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Currently operating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
            <Clock className="h-4 w-4 text-safety-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safety-600">
              {Math.round(routes.reduce((acc, route) => acc + route.onTimePerformance, 0) / routes.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600">
              {routes.reduce((acc, route) => acc + route.safetyIncidents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <CardDescription>
                    {route.startPoint} → {route.endPoint}
                  </CardDescription>
                </div>
                <Badge variant={route.status === "active" ? "success" : "secondary"}>
                  {route.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Route Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{route.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-gray-500" />
                    <span>{route.activeVehicles} vehicles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{route.totalStops} stops</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getPerformanceColor(route.onTimePerformance)}`}>
                      {Math.round(route.onTimePerformance)}%
                    </div>
                    <div className="text-xs text-gray-500">On-Time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getLoadColor(route.passengerLoad)}`}>
                      {Math.round(route.passengerLoad)}%
                    </div>
                    <div className="text-xs text-gray-500">Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{Math.round(route.averageSpeed)}</div>
                    <div className="text-xs text-gray-500">km/h</div>
                  </div>
                </div>

                {/* Active Vehicles */}
                <div>
                  <p className="text-sm font-medium mb-2">Active Vehicles:</p>
                  <div className="flex flex-wrap gap-1">
                    {route.vehicles.map((vehicle) => (
                      <Badge key={vehicle} variant="outline" className="text-xs">
                        {vehicle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Safety Status */}
                {route.safetyIncidents > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      {route.safetyIncidents} safety incident{route.safetyIncidents > 1 ? "s" : ""} this week
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedRoute(route)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-1" />
                    Track Live
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Route Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Route Performance Trends</CardTitle>
            <CardDescription>Weekly performance comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex justify-between items-center">
                <span className="text-sm">{route.name}</span>
                <div className="flex items-center gap-2">
                  {route.onTimePerformance >= 90 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${getPerformanceColor(route.onTimePerformance)}`}>
                    {Math.round(route.onTimePerformance)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passenger Load Analysis</CardTitle>
            <CardDescription>Current capacity utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{route.name}</span>
                  <span className={`font-medium ${getLoadColor(route.passengerLoad)}`}>
                    {Math.round(route.passengerLoad)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      route.passengerLoad >= 90
                        ? "bg-red-500"
                        : route.passengerLoad >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${route.passengerLoad}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRoute.name}</h2>
                  <p className="text-gray-600">
                    {selectedRoute.startPoint} → {selectedRoute.endPoint}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedRoute(null)}>
                  ✕
                </Button>
              </div>

              {/* Route Progress */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Current Progress</h3>
                <div className="space-y-3">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          stop.status === "completed"
                            ? "bg-green-500"
                            : stop.status === "current"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${stop.status === "current" ? "text-blue-600" : ""}`}>
                            {stop.name}
                          </span>
                          <span className="text-sm text-gray-500">{stop.time}</span>
                        </div>
                      </div>
                      {stop.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {stop.status === "current" && <Activity className="h-4 w-4 text-blue-500" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedRoute.distance}</div>
                  <div className="text-sm text-gray-600">Distance (km)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedRoute.estimatedTime}</div>
                  <div className="text-sm text-gray-600">Est. Time (min)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedRoute.activeVehicles}</div>
                  <div className="text-sm text-gray-600">Active Vehicles</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(selectedRoute.averageSpeed)}</div>
                  <div className="text-sm text-gray-600">Avg Speed (km/h)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
