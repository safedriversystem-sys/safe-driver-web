"use client"

import { useState, useCallback, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, Polyline } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPin, AlertTriangle, Shield, Trash2, Save, X, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { hazardService } from "@/lib/hazard-service"
import { routeService } from "@/lib/route-service"
import type { HazardZone, HazardType, Route } from "@/lib/route-types"
import { Badge } from "@/components/ui/badge"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
}

const center = {
  lat: 7.8731, // Sri Lanka center
  lng: 80.7718,
}

export function HazardMonitoringMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [hazards, setHazards] = useState<HazardZone[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedHazard, setSelectedHazard] = useState<HazardZone | null>(null)
  const [newHazardPos, setNewHazardPos] = useState<google.maps.LatLngLiteral | null>(null)
  const [hazardDetails, setHazardDetails] = useState({
    name: "",
    type: "other" as HazardType,
    radius: 500,
    location: "",
  })

  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [allHazards, allRoutes] = await Promise.all([
        hazardService.getAllHazards(),
        routeService.getAllRoutes(),
      ])
      setHazards(allHazards)
      setRoutes(allRoutes)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({ title: "Error", description: "Failed to load hazards and routes", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewHazardPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      setSelectedHazard(null)
      setHazardDetails({
        name: `Hazard at ${e.latLng.lat().toFixed(4)}, ${e.latLng.lng().toFixed(4)}`,
        type: "other",
        radius: 500,
        location: "Detected Location",
      })
    }
  }, [])

  const handleSaveHazard = async () => {
    if (!newHazardPos) return

    setSaving(true)
    try {
      await hazardService.saveHazard({
        name: hazardDetails.name,
        type: hazardDetails.type,
        radius: hazardDetails.radius,
        latitude: newHazardPos.lat,
        longitude: newHazardPos.lng,
        location: hazardDetails.location,
      })
      toast({ title: "Success", description: "Hazard zone saved and associated with routes." })
      setNewHazardPos(null)
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to save hazard zone", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteHazard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hazard zone?")) return

    try {
      await hazardService.deleteHazard(id)
      toast({ title: "Success", description: "Hazard zone deleted." })
      setSelectedHazard(null)
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete hazard zone", variant: "destructive" })
    }
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (!isLoaded) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border shadow-xl">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {/* Display Existing Hazards */}
          {hazards.map((hazard) => (
            <div key={hazard.id}>
              <Marker
                position={{ lat: hazard.latitude, lng: hazard.longitude }}
                icon={{
                  url: hazard.type === "accident" ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                }}
                onClick={() => setSelectedHazard(hazard)}
              />
              <Circle
                center={{ lat: hazard.latitude, lng: hazard.longitude }}
                radius={hazard.radius}
                options={{
                  fillColor: hazard.type === "accident" ? "#ef4444" : "#f59e0b",
                  fillOpacity: 0.2,
                  strokeColor: hazard.type === "accident" ? "#ef4444" : "#f59e0b",
                  strokeWeight: 1,
                }}
              />
            </div>
          ))}

          {/* New Hazard Marker */}
          {newHazardPos && (
            <Marker
              position={newHazardPos}
              animation={google.maps.Animation.BOUNCE}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Route Polylines */}
          {routes.map((route) => (
            <Polyline
              key={route.id}
              path={route.stops.map((s) => ({ lat: s.latitude || 0, lng: s.longitude || 0 })).filter(p => p.lat !== 0)}
              options={{
                strokeColor: "#4285F4",
                strokeOpacity: 0.3,
                strokeWeight: 4,
              }}
            />
          ))}

          {selectedHazard && (
            <InfoWindow
              position={{ lat: selectedHazard.latitude, lng: selectedHazard.longitude }}
              onCloseClick={() => setSelectedHazard(null)}
            >
              <div className="p-2 max-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{selectedHazard.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 capitalize">Type: {selectedHazard.type}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{selectedHazard.radius}m</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteHazard(selectedHazard.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-primary" />
              <p className="font-medium">Updating map data...</p>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {newHazardPos ? "New Hazard Details" : "Hazard Monitoring"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!newHazardPos ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                  <p className="font-bold mb-1">How to add a hazard:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click anywhere on the map</li>
                    <li>Fill in the danger details</li>
                    <li>Save to notify relevant routes</li>
                  </ul>
                </div>
                
                <div className="space-y-3 mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Zones ({hazards.length})</h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {hazards.map((h) => (
                      <div 
                        key={h.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedHazard(h)
                          if (map) map.panTo({ lat: h.latitude, lng: h.longitude })
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-full ${h.type === 'accident' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold truncate max-w-[120px]">{h.name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{h.type}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{h.radius}m</Badge>
                      </div>
                    ))}
                    {hazards.length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-8">No hazard zones defined yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Hazard Name</label>
                  <Input
                    value={hazardDetails.name}
                    onChange={(e) => setHazardDetails({ ...hazardDetails, name: e.target.value })}
                    placeholder="e.g. Dangerous Bend - Kottawa"
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
                  <Select
                    value={hazardDetails.type}
                    onValueChange={(val: HazardType) => setHazardDetails({ ...hazardDetails, type: val })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident Prone</SelectItem>
                      <SelectItem value="school">School Zone</SelectItem>
                      <SelectItem value="speed">Speed Trap</SelectItem>
                      <SelectItem value="restricted">Restricted Area</SelectItem>
                      <SelectItem value="other">Other Danger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Radius (meters)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={hazardDetails.radius}
                      onChange={(e) => setHazardDetails({ ...hazardDetails, radius: parseInt(e.target.value) })}
                      className="h-9"
                    />
                    <span className="text-xs text-muted-foreground font-medium">m</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Location Context</label>
                  <Input
                    value={hazardDetails.location}
                    onChange={(e) => setHazardDetails({ ...hazardDetails, location: e.target.value })}
                    placeholder="e.g. Near 105km post"
                    className="h-9"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 font-bold"
                    onClick={() => setNewHazardPos(null)}
                  >
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    className="flex-1 h-10 font-bold"
                    disabled={saving || !hazardDetails.name}
                    onClick={handleSaveHazard}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Routes passing within 2km will be automatically notified.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center gap-2 text-primary-400">
              <Navigation className="h-4 w-4" /> AUTO-ASSOCIATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              SafeDriver AI monitors all marked hazards. When a new hazard is saved, the system performs a proximity check against 
              <span className="text-white font-bold"> {routes.length} active routes</span>.
            </p>
            <div className="p-3 rounded-lg bg-neutral-800 border border-neutral-700 space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-500">
                <span>Algorithm</span>
                <span className="text-green-500">Active</span>
              </div>
              <p className="text-[11px] font-medium italic text-neutral-300">
                "Haversine Spherical Distance"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
