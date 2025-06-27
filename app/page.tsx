"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Users, AlertTriangle, CheckCircle, Activity, Shield, Bell, TrendingUp, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // Simple static data to avoid any undefined issues
  const fleetStats = {
    totalVehicles: 24,
    activeVehicles: 19,
    driversOnDuty: 15,
    alertsToday: 3,
    safetyScore: 94,
    complianceRate: 96,
  }

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Driver fatigue detected - Vehicle NB-1234",
      time: "2 minutes ago",
      status: "active",
    },
    {
      id: 2,
      type: "info",
      message: "Maintenance scheduled - Vehicle WP-5678",
      time: "15 minutes ago",
      status: "resolved",
    },
    {
      id: 3,
      type: "success",
      message: "Route completed successfully - Vehicle CP-9012",
      time: "1 hour ago",
      status: "resolved",
    },
  ]

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
            <div className="text-2xl font-bold">{fleetStats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">{fleetStats.activeVehicles} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers on Duty</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.driversOnDuty}</div>
            <p className="text-xs text-muted-foreground">Out of {fleetStats.totalVehicles} total drivers</p>
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
            <p className="text-xs text-muted-foreground">2 resolved, 1 active</p>
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
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                  {alert.type === "info" && <Clock className="h-5 w-5 text-blue-600" />}
                  {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{alert.message}</div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </div>
                  <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>{alert.status}</Badge>
                </div>
              ))}
            </div>
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

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Incident Rate</span>
                <span className="font-bold text-green-600">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Training Completion</span>
                <span className="font-bold">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance Score</span>
                <span className="font-bold text-blue-600">{fleetStats.complianceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Fleet Utilization</span>
                <span className="font-bold">79%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">On-Time Performance</span>
                <span className="font-bold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fuel Efficiency</span>
                <span className="font-bold">8.5 km/L</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Last Route Completed</div>
                <div className="text-gray-600">Colombo to Kandy - 2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Driver Check-in</div>
                <div className="text-gray-600">3 drivers started shifts</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">System Update</div>
                <div className="text-gray-600">Safety protocols updated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
