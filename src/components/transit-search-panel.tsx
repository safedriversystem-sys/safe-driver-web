"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Bus, X, Search, Map as MapIcon, ArrowRightLeft, AlertTriangle } from "lucide-react"
import type { TransitResponse, TransitRouteResult } from "@/lib/maps-service"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 7.8731, // Sri Lanka center
  lng: 80.7718
};

interface TransitSearchPanelProps {
  onClose: () => void;
}

export function TransitSearchPanel({ onClose }: TransitSearchPanelProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const [origin, setOrigin] = useState("Matara")
  const [destination, setDestination] = useState("Colombo")
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<TransitRouteResult[]>([])
  const [selectedRoute, setSelectedRoute] = useState<TransitRouteResult | null>(null)
  
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { toast } = useToast()

  const handleSearch = async () => {
    if (!origin || !destination) {
      toast({ title: "Error", description: "Please enter both origin and destination", variant: "destructive" })
      return
    }

    setLoading(true)
    setRoutes([])
    setSelectedRoute(null)
    setDirectionsResponse(null)

    try {
      const response = await fetch("/api/maps/transit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      })

      if (!response.ok) {
         throw new Error("Failed to fetch route data")
      }

      const data: TransitResponse = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        setRoutes(data.routes)
        setSelectedRoute(data.routes[0])
        if (isLoaded && GOOGLE_MAPS_API_KEY) {
           calculateMapDirections(data.routes[0])
        }
      } else {
         toast({ title: "No Routes", description: "Could not find any transit routes between these points.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({ title: "Search Failed", description: "Unable to find routes. Using mock data or please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const calculateMapDirections = (routeToRender?: TransitRouteResult) => {
      if (!isLoaded || !window.google) return;

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.TRANSIT,
        transitOptions: {
            modes: [window.google.maps.TransitMode.BUS]
        },
        provideRouteAlternatives: true
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
            let routeIndex = 0;
            if (routeToRender && routeToRender.duration) {
                const matchIndex = result.routes.findIndex(r => {
                    const dur = r.legs[0]?.duration?.value;
                    return dur && Math.abs(dur/60 - routeToRender.duration) < 10;
                });
                if (matchIndex !== -1) routeIndex = matchIndex;
            }
            
            setDirectionsResponse({ ...result, routes: [result.routes[routeIndex] || result.routes[0]] });
        } else {
            console.error("Directions query failed", status);
        }
      });
  }

  const handleRouteSelect = (route: TransitRouteResult) => {
      setSelectedRoute(route)
      calculateMapDirections(route)
  }

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-white flex overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Sidebar Panel */}
      <div className="w-full md:w-[450px] h-full flex flex-col shadow-2xl z-10 bg-white border-r">
        {/* Header Search Area */}
        <div className="p-6 bg-[#4285F4] text-white flex flex-col gap-5 shadow-md shrink-0">
            <div className="flex justify-between items-center mb-1">
                <h2 className="font-bold flex items-center gap-2 text-xl tracking-tight"><MapIcon className="h-6 w-6" /> Maps Routing</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8"><X className="h-5 w-5" /></Button>
            </div>
            
            <div className="relative pl-10 pr-2 flex flex-col gap-4">
                <div className="absolute left-2.5 top-3.5 bottom-3.5 flex flex-col items-center gap-1.5 w-4">
                   <div className="w-2.5 h-2.5 rounded-full border-[3px] border-white bg-transparent"></div>
                   <div className="w-0.5 flex-1 bg-white/40"></div>
                   <MapPin className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex items-center gap-3">
                  <Input 
                      value={origin} 
                      onChange={e => setOrigin(e.target.value)}
                      placeholder="Choose starting point"
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus-visible:ring-white h-12 rounded-xl text-base shadow-inner"
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Input 
                      value={destination} 
                      onChange={e => setDestination(e.target.value)}
                      placeholder="Choose destination"
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus-visible:ring-white h-12 rounded-xl text-base shadow-inner"
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                  <Button variant="ghost" size="icon" className="shrink-0 text-white hover:bg-white/20 rounded-full w-10 h-10 shadow-sm border border-white/10" onClick={() => {
                      const temp = origin; setOrigin(destination); setDestination(temp);
                  }}>
                      <ArrowRightLeft className="h-5 w-5 rotate-90" />
                  </Button>
                </div>
            </div>
            
            <Button onClick={handleSearch} disabled={loading} className="w-full bg-white text-[#4285F4] hover:bg-neutral-100 font-bold rounded-xl h-12 text-base shadow-lg hover:-translate-y-0.5 transition-all">
                {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Searching...</> : <><Search className="h-5 w-5 mr-2" /> Search Routes</>}
            </Button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 flex flex-col">
            {routes.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center shadow-inner">
                        <Bus className="h-10 w-10 text-neutral-300" />
                    </div>
                    <p className="text-lg font-medium">Enter a starting point and destination to see transit options.</p>
                </div>
            )}
            
            <div className="p-3 gap-3 flex flex-col">
              {routes.map((route, i) => (
                  <Card 
                      key={route.id || i} 
                      className={`cursor-pointer transition-all duration-200 border-2 rounded-2xl overflow-hidden ${selectedRoute?.id === route.id ? "border-[#4285F4] shadow-md bg-blue-50/20" : "border-neutral-100 shadow-sm hover:border-blue-200"}`}
                      onClick={() => handleRouteSelect(route)}
                  >
                      <div className="p-5 flex gap-5">
                          <div className="flex flex-col items-center justify-start gap-1.5 shrink-0 pt-1">
                              <div className={`p-2.5 rounded-full shadow-sm ${selectedRoute?.id === route.id ? 'bg-[#4285F4] text-white' : 'bg-blue-100 text-blue-600'}`}>
                                <Bus className="h-6 w-6" />
                              </div>
                              <span className="text-[11px] font-black uppercase text-neutral-400 mt-1">{route.distance.toFixed(1)} km</span>
                          </div>
                          <div className="flex-1 space-y-2.5">
                              <div className="flex justify-between items-start gap-2">
                                  <div>
                                      <h3 className="font-black text-2xl text-neutral-800 leading-none mb-1.5 tracking-tight">{Math.floor(route.duration/60) > 0 && `${Math.floor(route.duration/60)} hr `}{route.duration%60} min</h3>
                                      {route.departureTime && route.arrivalTime && (
                                         <p className="text-sm font-semibold text-neutral-500">{route.departureTime} — {route.arrivalTime}</p>
                                      )}
                                  </div>
                                  {route.busLine && (
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 px-2 py-0.5 text-xs font-bold shrink-0">
                                        {route.busLine}
                                    </Badge>
                                  )}
                              </div>
                              
                              {selectedRoute?.id === route.id && (
                                  <div className="mt-5 pt-5 border-t border-neutral-100 space-y-5 animate-in slide-in-from-top-2">
                                      <h4 className="text-xs font-black uppercase text-neutral-400 tracking-widest">Route Stops ({route.stops.length})</h4>
                                      <div className="relative pl-5 space-y-6 before:absolute before:inset-y-3 before:left-[9px] before:w-0.5 before:bg-blue-100">
                                          {route.stops.map((stop, idx) => (
                                              <div key={idx} className="relative">
                                                  <div className={`absolute -left-[25px] top-1.5 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm ${idx === 0 || idx === route.stops.length - 1 ? 'bg-blue-600 scale-125' : 'bg-blue-300'}`}></div>
                                                  <p className="text-base font-bold text-neutral-800 leading-tight">{stop.name}</p>
                                                  {stop.details && <p className="text-xs text-neutral-500 mt-1 font-medium">{stop.details}</p>}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </Card>
              ))}
            </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-neutral-100">
        {isLoaded && GOOGLE_MAPS_API_KEY ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={8}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: false,
            }}
          >
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                    directions: directionsResponse,
                    polylineOptions: {
                        strokeColor: "#4285F4",
                        strokeOpacity: 0.8,
                        strokeWeight: 6,
                    },
                    suppressMarkers: false,
                }}
              />
            )}
            
            {directionsResponse && selectedRoute && (() => {
               const route = directionsResponse.routes[0];
               if (!route || !route.legs || !route.legs[0]) return null;
               
               const leg = route.legs[0];
               const midpointIndex = Math.floor(leg.steps.length / 2);
               const midpoint = leg.steps[midpointIndex]?.start_location;
               
               if (!midpoint) return null;

               return (
                 <InfoWindow position={midpoint} options={{ disableAutoPan: true }}>
                    <div className="flex flex-col gap-0.5 px-1 py-0.5 font-sans">
                       <div className="flex items-center gap-2 text-neutral-800 font-bold text-sm whitespace-nowrap">
                          <Bus className="h-4 w-4 text-neutral-500" />
                          <span>
                             {Math.floor(selectedRoute.duration/60) > 0 ? `${Math.floor(selectedRoute.duration/60)} hr ` : ''}
                             {selectedRoute.duration%60} min
                          </span>
                       </div>
                       {selectedRoute.busLine && (
                          <div className="text-[10px] text-neutral-500 font-medium ml-6">
                             {selectedRoute.busLine}
                          </div>
                       )}
                    </div>
                 </InfoWindow>
               );
            })()}
            
            {/* Fallback markers if directions fail */}
            {!directionsResponse && selectedRoute?.stops.map((stop, i) => (
                <Marker 
                    key={i} 
                    position={{lat: stop.lat, lng: stop.lng}} 
                    label={{text: String(i+1), color: 'white', fontSize: '10px', fontWeight: 'bold'}}
                />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
             {!GOOGLE_MAPS_API_KEY ? (
                <div className="bg-white p-8 rounded-3xl shadow-lg border max-w-md">
                  <AlertTriangle className="h-16 w-16 mb-6 text-amber-500 mx-auto" />
                  <p className="font-black text-2xl text-neutral-800 mb-2">API Key Missing</p>
                  <p className="text-neutral-500">Please set <code className="bg-neutral-100 px-2 py-1 rounded text-neutral-800 text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your .env file to enable the interactive map.</p>
                </div>
             ) : (
                <><Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-500" /> <p className="text-lg font-medium">Loading Google Maps...</p></>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
