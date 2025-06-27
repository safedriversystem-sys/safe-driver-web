"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, MapPin, Clock, User, Car } from "lucide-react"

interface EmergencyIncident {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  driver: string
  vehicle: string
  location: string
  timestamp: Date
  status: "active" | "responding" | "resolved"
  description: string
}

export default function EmergencyPage() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([
    {
      id: "EMG-001",
      type: "Driver Medical Emergency",
      severity: "critical",
      driver: "John Smith",
      vehicle: "TRK-001",
      location: "Highway 101, Mile 45",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "active",
      description: "Driver reported chest pain and difficulty breathing",
    },
    {
      id: "EMG-002",
      type: "Vehicle Accident",
      severity: "high",
      driver: "Sarah Johnson",
      vehicle: "VAN-003",
      location: "Main St & 5th Ave",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "responding",
      description: "Minor collision with another vehicle, no injuries reported",
    },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "responding":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEmergencyAction = (incidentId: string, action: string) => {
    console.log(`Emergency action: ${action} for incident ${incidentId}`)
    // Here you would implement the actual emergency response actions
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Emergency Response Center
        </h1>
        <p className="text-gray-600 mt-2">Monitor and respond to emergency incidents in real-time</p>
      </div>

      {/* Emergency Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold text-red-600">
                  {incidents.filter((i) => i.status === "active").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responding</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {incidents.filter((i) => i.status === "responding").length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">3.2m</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Emergency Incidents</h2>

        {incidents.map((incident) => (
          <Card key={incident.id} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`} />
                  <CardTitle className="text-lg">{incident.type}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">{incident.timestamp.toLocaleTimeString()}</div>
              </div>
              <CardDescription>{incident.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Driver: {incident.driver}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Vehicle: {incident.vehicle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Location: {incident.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleEmergencyAction(incident.id, "call-911")}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call 911
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEmergencyAction(incident.id, "contact-driver")}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Contact Driver
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEmergencyAction(incident.id, "dispatch-help")}>
                  <Car className="h-4 w-4 mr-1" />
                  Dispatch Help
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEmergencyAction(incident.id, "view-location")}>
                  <MapPin className="h-4 w-4 mr-1" />
                  View Location
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
