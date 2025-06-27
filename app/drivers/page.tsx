"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Users, Phone, Mail, Activity, Plus, Search, Eye, Trash2 } from "lucide-react"

const mockDrivers = [
  {
    id: "DRV001",
    name: "Kamal Perera",
    licenseNumber: "B1234567",
    phone: "+94 77 123 4567",
    email: "kamal.perera@email.com",
    busNumber: "NB-1234",
    route: "Colombo - Kandy",
    status: "on_duty",
    alertCount: 3,
    safetyScore: 75,
    lastAlert: "2025-01-09 14:30:25",
    joinDate: "2023-05-15",
    experience: "8 years",
    address: "123 Main St, Colombo",
  },
  {
    id: "DRV002",
    name: "Sunil Silva",
    licenseNumber: "B2345678",
    phone: "+94 77 234 5678",
    email: "sunil.silva@email.com",
    busNumber: "WP-5678",
    route: "Galle - Matara",
    status: "on_duty",
    alertCount: 1,
    safetyScore: 92,
    lastAlert: "2025-01-09 14:25:10",
    joinDate: "2022-03-20",
    experience: "12 years",
    address: "456 Beach Rd, Galle",
  },
  {
    id: "DRV003",
    name: "Nimal Fernando",
    licenseNumber: "B3456789",
    phone: "+94 77 345 6789",
    email: "nimal.fernando@email.com",
    busNumber: "CP-9012",
    route: "Negombo - Colombo",
    status: "off_duty",
    alertCount: 0,
    safetyScore: 98,
    lastAlert: "2025-01-08 18:45:30",
    joinDate: "2021-11-10",
    experience: "15 years",
    address: "789 Church St, Negombo",
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    busNumber: "",
    route: "",
    address: "",
    experience: "",
  })

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_duty":
        return "success"
      case "off_duty":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const handleAddDriver = () => {
    const driver = {
      id: `DRV${String(drivers.length + 1).padStart(3, "0")}`,
      ...newDriver,
      status: "off_duty",
      alertCount: 0,
      safetyScore: 100,
      lastAlert: "Never",
      joinDate: new Date().toISOString().split("T")[0],
    }
    setDrivers([...drivers, driver])
    setNewDriver({
      name: "",
      licenseNumber: "",
      phone: "",
      email: "",
      busNumber: "",
      route: "",
      address: "",
      experience: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleContactDriver = (driver: any) => {
    alert(`Calling ${driver.name} at ${driver.phone}...`)
  }

  const handleToggleStatus = (driverId: string) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === driverId ? { ...driver, status: driver.status === "on_duty" ? "off_duty" : "on_duty" } : driver,
      ),
    )
  }

  const handleDeleteDriver = (driverId: string) => {
    if (confirm("Are you sure you want to remove this driver?")) {
      setDrivers(drivers.filter((driver) => driver.id !== driverId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600 mt-2">Manage driver profiles, performance, and safety records</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>Enter driver information to add them to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  placeholder="B1234567"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  placeholder="driver@email.com"
                />
              </div>
              <div>
                <Label htmlFor="bus">Bus Number</Label>
                <Input
                  id="bus"
                  value={newDriver.busNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, busNumber: e.target.value })}
                  placeholder="NB-1234"
                />
              </div>
              <div>
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  value={newDriver.route}
                  onChange={(e) => setNewDriver({ ...newDriver, route: e.target.value })}
                  placeholder="Colombo - Kandy"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={newDriver.experience}
                  onChange={(e) => setNewDriver({ ...newDriver, experience: e.target.value })}
                  placeholder="5 years"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <Button onClick={handleAddDriver} className="w-full">
                Add Driver
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold">{drivers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-green-600">
                  {drivers.filter((d) => d.status === "on_duty").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Performers</p>
                <p className="text-2xl font-bold text-green-600">{drivers.filter((d) => d.safetyScore >= 90).length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-red-600">{drivers.filter((d) => d.safetyScore < 80).length}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, license, or bus number..."
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
                <SelectItem value="on_duty">On Duty</SelectItem>
                <SelectItem value="off_duty">Off Duty</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers List */}
      <div className="space-y-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{driver.name}</h3>
                      <Badge variant={getStatusColor(driver.status)}>
                        {driver.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">License: {driver.licenseNumber}</p>
                    <p className="text-sm text-gray-600">
                      Bus: {driver.busNumber} • Route: {driver.route}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {driver.phone}
                      </span>
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {driver.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Safety Score</p>
                    <p className={`text-2xl font-bold ${getSafetyScoreColor(driver.safetyScore)}`}>
                      {driver.safetyScore}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Alerts</p>
                    <p className="text-2xl font-bold">{driver.alertCount}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedDriver(driver)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleContactDriver(driver)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant={driver.status === "on_duty" ? "destructive" : "success"}
                      onClick={() => handleToggleStatus(driver.id)}
                    >
                      {driver.status === "on_duty" ? "Set Off Duty" : "Set On Duty"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteDriver(driver.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Driver Details Dialog */}
      {selectedDriver && (
        <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Driver Details - {selectedDriver.name}</DialogTitle>
              <DialogDescription>Complete driver information and performance history</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="font-medium">{selectedDriver.name}</p>
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <p className="font-medium">{selectedDriver.licenseNumber}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedDriver.email}</p>
                  </div>
                  <div>
                    <Label>Bus Number</Label>
                    <p className="font-medium">{selectedDriver.busNumber}</p>
                  </div>
                  <div>
                    <Label>Route</Label>
                    <p className="font-medium">{selectedDriver.route}</p>
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <p className="font-medium">{selectedDriver.experience}</p>
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <p className="font-medium">{selectedDriver.joinDate}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p className="font-medium">{selectedDriver.address}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Safety Score</p>
                      <p className={`text-3xl font-bold ${getSafetyScoreColor(selectedDriver.safetyScore)}`}>
                        {selectedDriver.safetyScore}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Total Alerts</p>
                      <p className="text-3xl font-bold">{selectedDriver.alertCount}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={getStatusColor(selectedDriver.status)} className="mt-2">
                        {selectedDriver.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <div>
                  <Label>Last Alert</Label>
                  <p className="font-medium">{selectedDriver.lastAlert}</p>
                </div>
                <div>
                  <Label>Recent Activity</Label>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">• Completed route Colombo - Kandy (2 hours ago)</p>
                    <p className="text-sm">• Safety training completed (1 week ago)</p>
                    <p className="text-sm">• Vehicle inspection passed (2 weeks ago)</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600">No drivers match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
