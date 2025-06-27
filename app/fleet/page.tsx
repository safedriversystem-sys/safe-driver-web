"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Bus,
  MapPin,
  Wrench,
  CheckCircle,
  Fuel,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Navigation,
  User,
  Route,
  Gauge,
  Battery,
  Thermometer,
  Shield,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

// Mock fleet data
const mockVehicles = [
  {
    id: "VH001",
    busNumber: "NB-1234",
    model: "Tata LP 1618",
    year: 2022,
    status: "active",
    location: { lat: 6.9271, lng: 79.8612, address: "Colombo Fort" },
    driver: "Kamal Perera",
    route: "Colombo - Kandy",
    fuel: 85,
    mileage: 45230,
    lastService: "2024-12-15",
    nextService: "2025-02-15",
    maintenanceStatus: "good",
    speed: 45,
    engineTemp: 85,
    batteryLevel: 92,
    safetyScore: 88,
    alerts: 2,
    serviceHistory: [
      { date: "2024-12-15", type: "Regular Service", cost: 15000, description: "Oil change, brake inspection" },
      { date: "2024-10-20", type: "Tire Replacement", cost: 25000, description: "Replaced front tires" },
      { date: "2024-08-10", type: "Engine Maintenance", cost: 35000, description: "Engine tune-up and cleaning" },
    ],
  },
  {
    id: "VH002",
    busNumber: "WP-5678",
    model: "Ashok Leyland Viking",
    year: 2021,
    status: "maintenance",
    location: { lat: 6.0535, lng: 80.221, address: "Galle Workshop" },
    driver: "Sunil Silva",
    route: "Galle - Matara",
    fuel: 60,
    mileage: 67890,
    lastService: "2024-11-30",
    nextService: "2025-01-30",
    maintenanceStatus: "needs_attention",
    speed: 0,
    engineTemp: 70,
    batteryLevel: 88,
    safetyScore: 92,
    alerts: 1,
    serviceHistory: [
      { date: "2024-11-30", type: "Brake Service", cost: 18000, description: "Brake pad replacement" },
      { date: "2024-09-15", type: "Regular Service", cost: 12000, description: "Routine maintenance" },
    ],
  },
  {
    id: "VH003",
    busNumber: "CP-9012",
    model: "Eicher Skyline Pro",
    year: 2023,
    status: "active",
    location: { lat: 7.2906, lng: 80.6337, address: "Negombo Bus Stand" },
    driver: "Nimal Fernando",
    route: "Negombo - Colombo",
    fuel: 92,
    mileage: 23450,
    lastService: "2025-01-05",
    nextService: "2025-03-05",
    maintenanceStatus: "excellent",
    speed: 35,
    engineTemp: 82,
    batteryLevel: 95,
    safetyScore: 96,
    alerts: 0,
    serviceHistory: [
      { date: "2025-01-05", type: "Regular Service", cost: 14000, description: "Full service and inspection" },
      { date: "2024-11-10", type: "AC Service", cost: 8000, description: "AC system maintenance" },
    ],
  },
  {
    id: "VH004",
    busNumber: "SG-3456",
    model: "Tata Ultra 1518",
    year: 2020,
    status: "inactive",
    location: { lat: 7.9553, lng: 81.0014, address: "Anuradhapura Depot" },
    driver: "Ravi Kumara",
    route: "Anuradhapura - Polonnaruwa",
    fuel: 25,
    mileage: 89560,
    lastService: "2024-10-15",
    nextService: "2024-12-15",
    maintenanceStatus: "overdue",
    speed: 0,
    engineTemp: 65,
    batteryLevel: 75,
    safetyScore: 72,
    alerts: 4,
    serviceHistory: [
      { date: "2024-10-15", type: "Engine Repair", cost: 45000, description: "Major engine overhaul" },
      { date: "2024-08-20", type: "Transmission Service", cost: 28000, description: "Transmission fluid change" },
    ],
  },
]

const mockMaintenanceSchedule = [
  {
    id: "MS001",
    vehicleId: "VH001",
    busNumber: "NB-1234",
    type: "Regular Service",
    scheduledDate: "2025-02-15",
    status: "scheduled",
    priority: "medium",
    estimatedCost: 15000,
    description: "Routine maintenance and inspection",
  },
  {
    id: "MS002",
    vehicleId: "VH004",
    busNumber: "SG-3456",
    type: "Engine Repair",
    scheduledDate: "2025-01-20",
    status: "overdue",
    priority: "high",
    estimatedCost: 35000,
    description: "Engine diagnostic and repair",
  },
  {
    id: "MS003",
    vehicleId: "VH002",
    busNumber: "WP-5678",
    type: "Tire Replacement",
    scheduledDate: "2025-01-25",
    status: "in_progress",
    priority: "medium",
    estimatedCost: 22000,
    description: "Replace rear tires",
  },
]

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(mockMaintenanceSchedule)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [maintenanceFilter, setMaintenanceFilter] = useState("all")
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    busNumber: "",
    model: "",
    year: "",
    driver: "",
    route: "",
  })
  const [newMaintenance, setNewMaintenance] = useState({
    vehicleId: "",
    type: "",
    scheduledDate: "",
    priority: "medium",
    estimatedCost: "",
    description: "",
  })

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => ({
          ...vehicle,
          fuel: Math.max(20, vehicle.fuel + (Math.random() - 0.5) * 5),
          speed:
            vehicle.status === "active" ? Math.max(0, Math.min(60, vehicle.speed + (Math.random() - 0.5) * 10)) : 0,
          engineTemp: Math.max(70, Math.min(100, vehicle.engineTemp + (Math.random() - 0.5) * 3)),
          batteryLevel: Math.max(70, Math.min(100, vehicle.batteryLevel + (Math.random() - 0.5) * 2)),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "maintenance":
        return "warning"
      case "inactive":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "success"
      case "good":
        return "success"
      case "needs_attention":
        return "warning"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.route.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesMaintenance = maintenanceFilter === "all" || vehicle.maintenanceStatus === maintenanceFilter
    return matchesSearch && matchesStatus && matchesMaintenance
  })

  const addVehicle = () => {
    const vehicle = {
      id: `VH${String(vehicles.length + 1).padStart(3, "0")}`,
      busNumber: newVehicle.busNumber,
      model: newVehicle.model,
      year: Number.parseInt(newVehicle.year),
      status: "inactive",
      location: { lat: 6.9271, lng: 79.8612, address: "Colombo Depot" },
      driver: newVehicle.driver,
      route: newVehicle.route,
      fuel: 100,
      mileage: 0,
      lastService: new Date().toISOString().split("T")[0],
      nextService: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maintenanceStatus: "excellent",
      speed: 0,
      engineTemp: 75,
      batteryLevel: 100,
      safetyScore: 100,
      alerts: 0,
      serviceHistory: [],
    }
    setVehicles([...vehicles, vehicle])
    setNewVehicle({ busNumber: "", model: "", year: "", driver: "", route: "" })
    setShowAddVehicle(false)
  }

  const scheduleMaintenance = () => {
    const maintenance = {
      id: `MS${String(maintenanceSchedule.length + 1).padStart(3, "0")}`,
      vehicleId: newMaintenance.vehicleId,
      busNumber: vehicles.find((v) => v.id === newMaintenance.vehicleId)?.busNumber || "",
      type: newMaintenance.type,
      scheduledDate: newMaintenance.scheduledDate,
      status: "scheduled",
      priority: newMaintenance.priority,
      estimatedCost: Number.parseInt(newMaintenance.estimatedCost),
      description: newMaintenance.description,
    }
    setMaintenanceSchedule([...maintenanceSchedule, maintenance])
    setNewMaintenance({
      vehicleId: "",
      type: "",
      scheduledDate: "",
      priority: "medium",
      estimatedCost: "",
      description: "",
    })
    setShowMaintenanceDialog(false)
  }

  const updateVehicleStatus = (vehicleId: string, newStatus: string) => {
    setVehicles(vehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle)))
  }

  const deleteVehicle = (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Fleet Management System</h1>
        <p className="text-neutral-600">Comprehensive vehicle tracking, maintenance, and monitoring</p>
      </div>

      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Bus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {vehicles.filter((v) => v.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-warning-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {maintenanceSchedule.filter((m) => m.status === "overdue").length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel</CardTitle>
            <Fuel className="h-4 w-4 text-tech-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tech-600">
              {Math.round(vehicles.reduce((acc, v) => acc + v.fuel, 0) / vehicles.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-safety-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safety-600">
              {Math.round(vehicles.reduce((acc, v) => acc + v.safetyScore, 0) / vehicles.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vehicles">Vehicle Fleet</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="analytics">Fleet Analytics</TabsTrigger>
        </TabsList>

        {/* Vehicle Fleet Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vehicle Fleet Overview</CardTitle>
                  <CardDescription>Manage and monitor your entire vehicle fleet</CardDescription>
                </div>
                <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Vehicle</DialogTitle>
                      <DialogDescription>Enter vehicle details to add to the fleet</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="busNumber">Bus Number</Label>
                        <Input
                          id="busNumber"
                          value={newVehicle.busNumber}
                          onChange={(e) => setNewVehicle({ ...newVehicle, busNumber: e.target.value })}
                          placeholder="e.g., NB-1234"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Vehicle Model</Label>
                        <Input
                          id="model"
                          value={newVehicle.model}
                          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                          placeholder="e.g., Tata LP 1618"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driver">Assigned Driver</Label>
                        <Input
                          id="driver"
                          value={newVehicle.driver}
                          onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                          placeholder="Driver name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="route">Route</Label>
                        <Input
                          id="route"
                          value={newVehicle.route}
                          onChange={(e) => setNewVehicle({ ...newVehicle, route: e.target.value })}
                          placeholder="e.g., Colombo - Kandy"
                        />
                      </div>
                      <Button onClick={addVehicle} className="w-full">
                        Add Vehicle
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search vehicles..."
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
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={maintenanceFilter} onValueChange={setMaintenanceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Maintenance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="needs_attention">Needs Attention</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{vehicle.busNumber}</CardTitle>
                          <CardDescription>
                            {vehicle.model} ({vehicle.year})
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getStatusColor(vehicle.status)}>{vehicle.status.toUpperCase()}</Badge>
                          <Badge variant={getMaintenanceStatusColor(vehicle.maintenanceStatus)}>
                            {vehicle.maintenanceStatus.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Driver and Route Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{vehicle.driver}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-gray-500" />
                            <span>{vehicle.route}</span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{vehicle.location.address}</span>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-1">
                                <Fuel className="h-3 w-3" />
                                Fuel
                              </span>
                              <span className={`font-medium ${vehicle.fuel < 30 ? "text-red-600" : "text-green-600"}`}>
                                {Math.round(vehicle.fuel)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${vehicle.fuel < 30 ? "bg-red-500" : "bg-green-500"}`}
                                style={{ width: `${vehicle.fuel}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-1">
                                <Battery className="h-3 w-3" />
                                Battery
                              </span>
                              <span className="font-medium text-blue-600">{Math.round(vehicle.batteryLevel)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${vehicle.batteryLevel}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-500">
                              <Gauge className="h-3 w-3" />
                              <span>Speed</span>
                            </div>
                            <div className="font-medium">{Math.round(vehicle.speed)} km/h</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-500">
                              <Thermometer className="h-3 w-3" />
                              <span>Engine</span>
                            </div>
                            <div
                              className={`font-medium ${vehicle.engineTemp > 95 ? "text-red-600" : "text-green-600"}`}
                            >
                              {Math.round(vehicle.engineTemp)}°C
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-500">
                              <Shield className="h-3 w-3" />
                              <span>Safety</span>
                            </div>
                            <div className="font-medium text-blue-600">{vehicle.safetyScore}%</div>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="border-t pt-3 text-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span>Last Service:</span>
                            <span>{vehicle.lastService}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Next Service:</span>
                            <span
                              className={new Date(vehicle.nextService) < new Date() ? "text-red-600 font-medium" : ""}
                            >
                              {vehicle.nextService}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedVehicle(vehicle)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Select
                            value={vehicle.status}
                            onValueChange={(value) => updateVehicleStatus(vehicle.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="destructive" onClick={() => deleteVehicle(vehicle.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Vehicle Tracking</CardTitle>
              <CardDescription>Monitor live locations and status of all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Map Placeholder */}
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-6">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map View</p>
                  <p className="text-sm text-gray-500">Real-time vehicle locations would be displayed here</p>
                </div>
              </div>

              {/* Vehicle Status List */}
              <div className="space-y-3">
                <h4 className="font-semibold">Active Vehicles</h4>
                {vehicles
                  .filter((v) => v.status === "active")
                  .map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium">{vehicle.busNumber}</p>
                          <p className="text-sm text-gray-600">{vehicle.location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Speed</p>
                          <p className="font-medium">{Math.round(vehicle.speed)} km/h</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Driver</p>
                          <p className="font-medium">{vehicle.driver}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Manage vehicle maintenance and service schedules</CardDescription>
                </div>
                <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Maintenance</DialogTitle>
                      <DialogDescription>Schedule maintenance for a vehicle</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicleSelect">Vehicle</Label>
                        <Select
                          value={newMaintenance.vehicleId}
                          onValueChange={(value) => setNewMaintenance({ ...newMaintenance, vehicleId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.busNumber} - {vehicle.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maintenanceType">Maintenance Type</Label>
                        <Input
                          id="maintenanceType"
                          value={newMaintenance.type}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, type: e.target.value })}
                          placeholder="e.g., Regular Service, Brake Repair"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scheduledDate">Scheduled Date</Label>
                        <Input
                          id="scheduledDate"
                          type="date"
                          value={newMaintenance.scheduledDate}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, scheduledDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newMaintenance.priority}
                          onValueChange={(value) => setNewMaintenance({ ...newMaintenance, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estimatedCost">Estimated Cost (LKR)</Label>
                        <Input
                          id="estimatedCost"
                          type="number"
                          value={newMaintenance.estimatedCost}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, estimatedCost: e.target.value })}
                          placeholder="15000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newMaintenance.description}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                          placeholder="Maintenance details..."
                        />
                      </div>
                      <Button onClick={scheduleMaintenance} className="w-full">
                        Schedule Maintenance
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((maintenance) => (
                  <div key={maintenance.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{maintenance.busNumber}</h4>
                        <p className="text-sm text-gray-600">{maintenance.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={
                            maintenance.status === "overdue"
                              ? "destructive"
                              : maintenance.status === "in_progress"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {maintenance.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Scheduled Date</p>
                        <p className="font-medium">{maintenance.scheduledDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Cost</p>
                        <p className="font-medium">LKR {maintenance.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Description</p>
                        <p className="font-medium">{maintenance.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Average Fuel Efficiency</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">12.5 km/L</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maintenance Cost (Monthly)</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-bold text-red-600">LKR 245,000</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fleet Utilization</span>
                  <span className="font-bold text-blue-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>On-Time Performance</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Overview</CardTitle>
                <CardDescription>Maintenance statistics and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Scheduled This Month</span>
                  <span className="font-bold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed This Month</span>
                  <span className="font-bold text-green-600">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overdue</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Cost per Service</span>
                  <span className="font-bold text-gray-900">LKR 18,500</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Status Distribution</CardTitle>
              <CardDescription>Current status of all vehicles in the fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {vehicles.filter((v) => v.status === "active").length}
                  </div>
                  <p className="text-sm text-gray-600">Active Vehicles</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{
                        width: `${(vehicles.filter((v) => v.status === "active").length / vehicles.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {vehicles.filter((v) => v.status === "maintenance").length}
                  </div>
                  <p className="text-sm text-gray-600">In Maintenance</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{
                        width: `${(vehicles.filter((v) => v.status === "maintenance").length / vehicles.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">
                    {vehicles.filter((v) => v.status === "inactive").length}
                  </div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-gray-500 rounded-full"
                      style={{
                        width: `${(vehicles.filter((v) => v.status === "inactive").length / vehicles.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedVehicle.busNumber} - Detailed Information</DialogTitle>
              <DialogDescription>
                {selectedVehicle.model} ({selectedVehicle.year})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Vehicle Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(selectedVehicle.speed)}</div>
                  <div className="text-sm text-gray-600">Speed (km/h)</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round(selectedVehicle.fuel)}%</div>
                  <div className="text-sm text-gray-600">Fuel Level</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(selectedVehicle.engineTemp)}°C</div>
                  <div className="text-sm text-gray-600">Engine Temp</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedVehicle.safetyScore}%</div>
                  <div className="text-sm text-gray-600">Safety Score</div>
                </div>
              </div>

              {/* Service History */}
              <div>
                <h4 className="font-semibold mb-3">Service History</h4>
                <div className="space-y-3">
                  {selectedVehicle.serviceHistory.map((service, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{service.type}</p>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">LKR {service.cost.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{service.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
