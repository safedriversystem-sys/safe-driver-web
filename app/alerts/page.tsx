"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, MapPin, Clock, RefreshCw, CheckCircle, Bell, Volume, VolumeX } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoiceAlertManager } from "@/lib/voice-alert-manager"
import { EmergencyResponseSystem } from "@/lib/emergency-response-system"

// Mock data for alerts
const mockAlerts = [
  {
    id: "ALT001",
    type: "drowsiness",
    severity: "high",
    driverName: "Kamal Perera",
    driverId: "DRV001",
    busNumber: "NB-1234",
    route: "Colombo - Kandy",
    location: "Kadawatha Junction",
    timestamp: new Date().toISOString(),
    status: "active",
    description: "Driver showing signs of drowsiness",
  },
  {
    id: "ALT002",
    type: "phone_usage",
    severity: "medium",
    driverName: "Sunil Silva",
    driverId: "DRV002",
    busNumber: "WP-5678",
    route: "Galle - Matara",
    location: "Hikkaduwa",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: "acknowledged",
    description: "Driver using phone while driving",
  },
  {
    id: "ALT003",
    type: "speeding",
    severity: "medium",
    driverName: "Nimal Perera",
    driverId: "DRV003",
    busNumber: "CP-9012",
    route: "Colombo - Negombo",
    location: "Ja-Ela",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: "active",
    description: "Vehicle exceeding speed limit by 15 km/h",
  },
  {
    id: "ALT004",
    type: "distraction",
    severity: "high",
    driverName: "Amal Fernando",
    driverId: "DRV004",
    busNumber: "WP-3456",
    route: "Colombo - Gampaha",
    location: "Kelaniya",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: "resolved",
    description: "Driver distracted for more than 5 seconds",
  },
  {
    id: "ALT005",
    type: "maintenance",
    severity: "low",
    driverName: "Saman Kumara",
    driverId: "DRV005",
    busNumber: "SP-7890",
    route: "Matara - Galle",
    location: "Weligama",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    status: "active",
    description: "Vehicle maintenance due in 2 days",
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState(mockAlerts)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true)

  useEffect(() => {
    // Filter alerts based on active tab
    if (activeTab === "all") {
      setFilteredAlerts(alerts)
    } else {
      setFilteredAlerts(alerts.filter((alert) => alert.status === activeTab))
    }
  }, [alerts, activeTab])

  useEffect(() => {
    // Check if voice alerts are enabled in localStorage
    const savedVoiceAlertsEnabled = localStorage.getItem("safedriver-voice-alerts-enabled")
    if (savedVoiceAlertsEnabled !== null) {
      setVoiceAlertsEnabled(savedVoiceAlertsEnabled === "true")
    }

    // Set up event listener for voice commands
    const handleVoiceAcknowledge = () => {
      // Find the first active alert and acknowledge it
      const activeAlert = alerts.find((alert) => alert.status === "active")
      if (activeAlert) {
        handleAcknowledgeAlert(activeAlert.id)
      }
    }

    document.addEventListener("voice-acknowledge-alert", handleVoiceAcknowledge)

    // Set up emergency response system
    const emergencySystem = EmergencyResponseSystem.getInstance()

    // Simulate emergency triggers for high severity alerts
    const handleEmergencyTrigger = (alert: any) => {
      if (alert.severity === "high" && alert.type === "drowsiness") {
        emergencySystem.triggerEmergency("drowsiness_level_critical", {
          driverId: alert.driverId,
          vehicleId: alert.busNumber,
          location: {
            latitude: 6.9271,
            longitude: 79.8612,
            address: alert.location,
          },
          description: `Critical drowsiness detected for driver ${alert.driverName}`,
          severity: "critical",
          metadata: { alertId: alert.id },
        })
      }
    }

    // Check for emergency conditions in existing alerts
    alerts.forEach((alert) => {
      if (alert.status === "active" && alert.severity === "high") {
        handleEmergencyTrigger(alert)
      }
    })

    // Clean up
    return () => {
      document.removeEventListener("voice-acknowledge-alert", handleVoiceAcknowledge)
    }
  }, [alerts])

  const refreshAlerts = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Add a new random alert occasionally
      if (Math.random() > 0.5) {
        const alertTypes = ["drowsiness", "phone_usage", "speeding", "distraction", "maintenance"]
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        const randomDriver = ["Kamal Perera", "Sunil Silva", "Nimal Perera", "Amal Fernando", "Saman Kumara"][
          Math.floor(Math.random() * 5)
        ]
        const randomDriverId = ["DRV001", "DRV002", "DRV003", "DRV004", "DRV005"][Math.floor(Math.random() * 5)]
        const randomBus = ["NB-1234", "WP-5678", "CP-9012", "WP-3456", "SP-7890"][Math.floor(Math.random() * 5)]
        const randomRoute = [
          "Colombo - Kandy",
          "Galle - Matara",
          "Colombo - Negombo",
          "Colombo - Gampaha",
          "Matara - Galle",
        ][Math.floor(Math.random() * 5)]
        const randomLocation = ["Kadawatha Junction", "Hikkaduwa", "Ja-Ela", "Kelaniya", "Weligama"][
          Math.floor(Math.random() * 5)
        ]

        const newAlert = {
          id: `ALT${Date.now()}`,
          type: randomType,
          severity:
            randomType === "drowsiness" || randomType === "distraction"
              ? "high"
              : randomType === "maintenance"
                ? "low"
                : "medium",
          driverName: randomDriver,
          driverId: randomDriverId,
          busNumber: randomBus,
          route: randomRoute,
          location: randomLocation,
          timestamp: new Date().toISOString(),
          status: "active",
          description: getAlertDescription(randomType),
        }

        // After creating newAlert, add emergency check:
        if (newAlert.severity === "high" && (newAlert.type === "drowsiness" || newAlert.type === "distraction")) {
          const emergencySystem = EmergencyResponseSystem.getInstance()
          emergencySystem.triggerEmergency(`${newAlert.type}_level_critical`, {
            driverId: newAlert.driverId,
            vehicleId: newAlert.busNumber,
            location: {
              latitude: 6.9271,
              longitude: 79.8612,
              address: newAlert.location,
            },
            description: `Critical ${newAlert.type} detected for driver ${newAlert.driverName}`,
            severity: "critical",
            metadata: { alertId: newAlert.id },
          })
        }

        setAlerts((prev) => [newAlert, ...prev])

        // Play voice alert for new alert if enabled
        if (voiceAlertsEnabled) {
          const alertManager = VoiceAlertManager.getInstance()
          alertManager.addAlert(VoiceAlertManager.createDriverAlert(randomDriver, randomType))
        }
      }

      setIsLoading(false)
    }, 1000)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" } : alert)))
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" } : alert)))
  }

  const handleContactDriver = (alert: any) => {
    // In a real app, this would initiate contact with the driver
    console.log(`Contacting driver ${alert.driverName}`)
  }

  const toggleVoiceAlerts = () => {
    const newState = !voiceAlertsEnabled
    setVoiceAlertsEnabled(newState)

    // Update alert manager
    const alertManager = VoiceAlertManager.getInstance()
    alertManager.setEnabled(newState)

    // Save preference
    localStorage.setItem("safedriver-voice-alerts-enabled", String(newState))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "drowsiness":
      case "distraction":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "phone_usage":
      case "speeding":
        return <Bell className="h-5 w-5 text-yellow-500" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertDescription = (type: string) => {
    switch (type) {
      case "drowsiness":
        return "Driver showing signs of drowsiness"
      case "phone_usage":
        return "Driver using phone while driving"
      case "speeding":
        return "Vehicle exceeding speed limit"
      case "distraction":
        return "Driver distracted for extended period"
      case "maintenance":
        return "Vehicle maintenance due"
      default:
        return "Alert detected"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Safety Alerts</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleVoiceAlerts} className="flex items-center gap-2">
            {voiceAlertsEnabled ? <Volume className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Voice Alerts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAlerts}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({alerts.filter((a) => a.status === "active").length})</TabsTrigger>
          <TabsTrigger value="acknowledged">
            Acknowledged ({alerts.filter((a) => a.status === "acknowledged").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({alerts.filter((a) => a.status === "resolved").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg">{alert.description}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{alert.driverName}</span>
                          <span>•</span>
                          <span>{alert.busNumber}</span>
                          <span>•</span>
                          <span>{formatTime(alert.timestamp)}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Route:</span>
                      <span className="text-sm">{alert.route}</span>
                    </div>
                  </div>

                  {alert.status === "active" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactDriver(alert)}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Contact Driver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Resolve
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No alerts found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeTab === "all" ? "There are no alerts at the moment." : `There are no ${activeTab} alerts.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
