"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Users, AlertTriangle, CheckCircle, Activity, Shield, Bell, TrendingUp, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useLiveAlerts } from "@/hooks/use-live-alerts"

// Helper function to format relative time
const formatRelativeTime = (timestamp: string | number): string => {
  if (!timestamp) return "Unknown"
  
  const timestampMs = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp
  const now = Date.now()
  const diffMs = now - timestampMs
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  }
}

// Helper function to get alert icon and type
const getAlertDisplay = (alert: any) => {
  const type = alert.type?.toLowerCase() || ""
  const severity = alert.severity || "low"

  if (type === "drowsiness" || severity === "high") {
    return { icon: AlertTriangle, color: "text-orange-600", displayType: "warning" }
  }
  if (type === "phone_usage" || type === "distraction") {
    return { icon: Clock, color: "text-blue-600", displayType: "info" }
  }
  return { icon: CheckCircle, color: "text-green-600", displayType: "success" }
}

export default function HomePage() {
  // Get real-time alerts from Firebase
  const { alerts: liveAlerts, isLoading: isLoadingAlerts } = useLiveAlerts()
  
  // Driver stats state
  const [driverStats, setDriverStats] = useState({
    total: 0,
    onDuty: 0,
    offDuty: 0,
    suspended: 0,
  })
  const [isLoadingDriverStats, setIsLoadingDriverStats] = useState(true)

  // Fleet vehicles state
  const [fleetVehicles, setFleetVehicles] = useState<any[]>([])
  const [isLoadingFleet, setIsLoadingFleet] = useState(true)

  // Fetch driver stats
  useEffect(() => {
    const fetchDriverStats = async () => {
      try {
        setIsLoadingDriverStats(true)
        const response = await fetch("/api/drivers/stats", {
          cache: "no-store",
        })
        if (response.ok) {
          const stats = await response.json()
          setDriverStats(stats)
        }
      } catch (error) {
        console.error("Error fetching driver stats:", error)
      } finally {
        setIsLoadingDriverStats(false)
      }
    }

    fetchDriverStats()
    // Refresh driver stats every 30 seconds
    const interval = setInterval(fetchDriverStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch fleet vehicles
  useEffect(() => {
    const fetchFleetVehicles = async () => {
      try {
        setIsLoadingFleet(true)
        const response = await fetch("/api/fleet", {
          cache: "no-store",
        })
        if (response.ok) {
          const vehicles = await response.json()
          setFleetVehicles(vehicles)
        }
      } catch (error) {
        console.error("Error fetching fleet vehicles:", error)
      } finally {
        setIsLoadingFleet(false)
      }
    }

    fetchFleetVehicles()
    // Refresh fleet data every 30 seconds
    const interval = setInterval(fetchFleetVehicles, 30000)
    return () => clearInterval(interval)
  }, [])

  // Helper function to check if alert is from today
  const isToday = (timestamp: string | number | undefined): boolean => {
    if (!timestamp) return false
    
    try {
      // Get today's date at midnight for accurate comparison
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Handle both string and number timestamps
      let alertTimestamp: number
      if (typeof timestamp === "string") {
        alertTimestamp = new Date(timestamp).getTime()
      } else if (typeof timestamp === "number") {
        // If it's a number, check if it's in seconds or milliseconds
        alertTimestamp = timestamp < 10000000000 ? timestamp * 1000 : timestamp
      } else {
        return false
      }
      
      // Check if timestamp is valid
      if (isNaN(alertTimestamp)) return false
      
      const alertDate = new Date(alertTimestamp)
      alertDate.setHours(0, 0, 0, 0)
      
      // Compare dates
      return alertDate.getTime() === today.getTime()
    } catch (error) {
      console.error("Error parsing alert timestamp:", timestamp, error)
      return false
    }
  }

  // Calculate stats from real-time data
  const fleetStats = useMemo(() => {
    const activeAlerts = liveAlerts.filter((a) => a.status === "active").length
    const resolvedAlerts = liveAlerts.filter((a) => a.status === "resolved").length
    
    // Get today's alerts
    const todayAlertsList = liveAlerts.filter((alert) => isToday(alert.timestamp))
    const todayAlerts = todayAlertsList.length
    const todayActiveAlerts = todayAlertsList.filter((a) => a.status === "active").length
    const todayResolvedAlerts = todayAlertsList.filter((a) => a.status === "resolved").length

    // Get fleet statistics from fleet management
    const totalVehicles = fleetVehicles.length || 0
    const activeVehicles = fleetVehicles.filter((v) => v.status === "active").length || 0
    
    // Calculate safety score based on alerts (fewer alerts = higher score)
    const totalAlerts = liveAlerts.length
    const highSeverityAlerts = liveAlerts.filter((a) => a.severity === "high").length
    const safetyScore = totalAlerts > 0 
      ? Math.max(0, Math.min(100, 100 - (highSeverityAlerts * 10) - (totalAlerts * 2)))
      : 100

    return {
      totalVehicles,
      activeVehicles,
      driversOnDuty: driverStats.onDuty || 0,
      totalDrivers: driverStats.total || 0,
      alertsToday: todayAlerts,
      todayActiveAlerts,
      todayResolvedAlerts,
      safetyScore: Math.round(safetyScore),
      complianceRate: 96, // This would need to come from another data source
    }
  }, [liveAlerts, driverStats, fleetVehicles])

  // Get recent alerts (latest 3, sorted by timestamp)
  const recentAlerts = useMemo(() => {
    if (!liveAlerts || liveAlerts.length === 0) {
      return []
    }

    return liveAlerts
      .sort((a, b) => {
        const timeA = a.timestamp ? (typeof a.timestamp === "string" ? new Date(a.timestamp).getTime() : a.timestamp) : 0
        const timeB = b.timestamp ? (typeof b.timestamp === "string" ? new Date(b.timestamp).getTime() : b.timestamp) : 0
        return timeB - timeA
      })
      .slice(0, 3)
      .map((alert) => {
        const display = getAlertDisplay(alert)
        const busNumber = alert.number_plate || alert.busNumber || "Unknown"
        const message = alert.description || `${alert.type} detected`
        
        return {
          id: alert.id,
          type: display.displayType,
          message: `${message}${busNumber !== "Unknown" ? ` - Vehicle ${busNumber}` : ""}`,
          time: formatRelativeTime(alert.timestamp || Date.now()),
          status: alert.status || "active",
          icon: display.icon,
          color: display.color,
        }
      })
  }, [liveAlerts])

  const quickActions = [
    { title: "View Fleet", href: "/fleet", icon: Car, color: "bg-blue-500" },
    { title: "Manage Drivers", href: "/drivers", icon: Users, color: "bg-green-500" },
    { title: "View Routes", href: "/routes", icon: MapPin, color: "bg-purple-500" },
    { title: "Analytics", href: "/analytics", icon: Activity, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">SafeDriver Dashboard</h1>
        <p className="text-gray-600">Monitor your fleet safety and performance in real-time</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingFleet ? "..." : fleetStats.totalVehicles}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingFleet ? "..." : fleetStats.activeVehicles} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers on Duty</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingDriverStats ? "..." : fleetStats.driversOnDuty}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {isLoadingDriverStats ? "..." : fleetStats.totalDrivers} total drivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{fleetStats.safetyScore}%</div>
            <Progress value={fleetStats.safetyScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.alertsToday}</div>
            <p className="text-xs text-muted-foreground">
              {fleetStats.todayResolvedAlerts} resolved, {fleetStats.todayActiveAlerts} active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest safety and operational alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAlerts ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Loading alerts...</div>
              </div>
            ) : recentAlerts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">No recent alerts</div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => {
                  const IconComponent = alert.icon || AlertTriangle
                  return (
                    <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <IconComponent className={`h-5 w-5 ${alert.color || "text-gray-600"}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alert.message}</div>
                        <div className="text-xs text-gray-500">{alert.time}</div>
                      </div>
                      <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>
                        {alert.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/alerts">View All Alerts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">GPS Tracking</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Camera Systems</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Communication</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Data Processing</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Processing</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Overall Health</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <Progress value={98} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Access key features and management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <Link href={action.href}>
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
