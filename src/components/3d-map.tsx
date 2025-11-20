"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense, useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Eye, EyeOff, Layers, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

// Mock data for 3D visualization
const mockVehicles = [
  { id: "V001", position: [2, 0.1, 1], status: "active", driver: "Kamal Perera", route: "Colombo-Kandy" },
  { id: "V002", position: [-1, 0.1, 2], status: "warning", driver: "Sunil Silva", route: "Galle-Matara" },
  { id: "V003", position: [3, 0.1, -1], status: "safe", driver: "Nimal Fernando", route: "Negombo-Colombo" },
]

const mockGeofences = [
  {
    id: "GF001",
    type: "school_zone",
    position: [0, 0, 0],
    radius: 2,
    height: 0.5,
    name: "Royal College School Zone",
    color: "#3b82f6",
  },
  {
    id: "GF002",
    type: "restricted",
    position: [4, 0, 2],
    radius: 1.5,
    height: 1,
    name: "Military Restricted Area",
    color: "#ef4444",
  },
  {
    id: "GF003",
    type: "speed_zone",
    position: [-2, 0, -2],
    radius: 3,
    height: 0.3,
    name: "Highway Speed Zone",
    color: "#f59e0b",
  },
]

const mockRoutes = [
  {
    id: "R001",
    name: "Colombo-Kandy Express",
    points: [
      [0, 0.05, 0],
      [1, 0.05, 0.5],
      [2, 0.05, 1],
      [3, 0.05, 1.5],
      [4, 0.05, 2],
    ],
    color: "#10b981",
  },
  {
    id: "R002",
    name: "Galle-Matara Coastal",
    points: [
      [-2, 0.05, -1],
      [-1, 0.05, 0],
      [0, 0.05, 1],
      [1, 0.05, 2],
      [2, 0.05, 3],
    ],
    color: "#8b5cf6",
  },
]

// 3D Vehicle Component
function Vehicle({ position, status, id, driver, route, onClick }: any) {
  const meshRef = useRef<any>()
  const [hovered, setHovered] = useState(false)

  const color = useMemo(() => {
    switch (status) {
      case "warning":
        return "#ef4444"
      case "safe":
        return "#10b981"
      default:
        return "#3b82f6"
    }
  }, [status])

  return (
    <group position={position}>
      {/* Vehicle Body */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[0.3, 0.15, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Vehicle Status Indicator */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      {/* Vehicle Label */}
      <Html position={[0, 0.5, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium shadow-lg border">
          <div className="font-bold">{id}</div>
          <div className="text-gray-600">{driver}</div>
        </div>
      </Html>
    </group>
  )
}

// 3D Geofence Component
function Geofence({ position, radius, height, color, name, type, onClick }: any) {
  const meshRef = useRef<any>()
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      {/* Geofence Cylinder */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color={color} transparent opacity={hovered ? 0.4 : 0.2} wireframe={false} />
      </mesh>

      {/* Geofence Border */}
      <mesh position={[0, height / 2 + 0.01, 0]}>
        <ringGeometry args={[radius - 0.1, radius + 0.1, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Geofence Label */}
      <Html position={[0, height + 0.5, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium shadow-lg border">
          <div className="font-bold">{name}</div>
          <Badge variant="outline" className="text-xs">
            {type.replace("_", " ")}
          </Badge>
        </div>
      </Html>
    </group>
  )
}

// 3D Route Component
function Route({ points, color, name }: any) {
  const lineRef = useRef<any>()

  const geometry = useMemo(() => {
    const vertices = points.flat()
    return vertices
  }, [points])

  return (
    <group>
      {/* Route Line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(geometry)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>

      {/* Route Points */}
      {points.map((point: any, index: number) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

// Ground Plane Component
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

// 3D Scene Component
function Scene({ showVehicles, showGeofences, showRoutes, onVehicleClick, onGeofenceClick }: any) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <Ground />

      {/* Vehicles */}
      {showVehicles &&
        mockVehicles.map((vehicle) => (
          <Vehicle
            key={vehicle.id}
            position={vehicle.position}
            status={vehicle.status}
            id={vehicle.id}
            driver={vehicle.driver}
            route={vehicle.route}
            onClick={() => onVehicleClick(vehicle)}
          />
        ))}

      {/* Geofences */}
      {showGeofences &&
        mockGeofences.map((geofence) => (
          <Geofence
            key={geofence.id}
            position={geofence.position}
            radius={geofence.radius}
            height={geofence.height}
            color={geofence.color}
            name={geofence.name}
            type={geofence.type}
            onClick={() => onGeofenceClick(geofence)}
          />
        ))}

      {/* Routes */}
      {showRoutes &&
        mockRoutes.map((route) => <Route key={route.id} points={route.points} color={route.color} name={route.name} />)}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />
    </>
  )
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Loading 3D Map...</p>
      </div>
    </div>
  )
}

// Main 3D Map Component
export function ThreeDMap() {
  const [showVehicles, setShowVehicles] = useState(true)
  const [showGeofences, setShowGeofences] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const canvasRef = useRef<any>()

  const handleVehicleClick = (vehicle: any) => {
    setSelectedItem({ type: "vehicle", data: vehicle })
  }

  const handleGeofenceClick = (geofence: any) => {
    setSelectedItem({ type: "geofence", data: geofence })
  }

  const resetCamera = () => {
    // Reset camera position logic would go here
    console.log("Resetting camera position")
  }

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <div className="w-full h-[600px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden">
        <Canvas ref={canvasRef} camera={{ position: [8, 8, 8], fov: 60 }} shadows>
          <Suspense fallback={null}>
            <Scene
              showVehicles={showVehicles}
              showGeofences={showGeofences}
              showRoutes={showRoutes}
              onVehicleClick={handleVehicleClick}
              onGeofenceClick={handleGeofenceClick}
            />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Map Layers
        </h3>
        <div className="space-y-2">
          <Button
            variant={showVehicles ? "default" : "outline"}
            size="sm"
            onClick={() => setShowVehicles(!showVehicles)}
            className="w-full justify-start"
          >
            {showVehicles ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Vehicles ({mockVehicles.length})
          </Button>
          <Button
            variant={showGeofences ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGeofences(!showGeofences)}
            className="w-full justify-start"
          >
            {showGeofences ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Geofences ({mockGeofences.length})
          </Button>
          <Button
            variant={showRoutes ? "default" : "outline"}
            size="sm"
            onClick={() => setShowRoutes(!showRoutes)}
            className="w-full justify-start"
          >
            {showRoutes ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Routes ({mockRoutes.length})
          </Button>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={resetCamera}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Active Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Warning Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Safe Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/30 rounded-full border-2 border-blue-500"></div>
            <span>School Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/30 rounded-full border-2 border-red-500"></div>
            <span>Restricted Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500/30 rounded-full border-2 border-yellow-500"></div>
            <span>Speed Zone</span>
          </div>
        </div>
      </div>

      {/* Selected Item Details */}
      {selectedItem && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">
              {selectedItem.type === "vehicle" ? "Vehicle Details" : "Geofence Details"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
              ×
            </Button>
          </div>

          {selectedItem.type === "vehicle" ? (
            <div className="space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {selectedItem.data.id}
              </div>
              <div>
                <strong>Driver:</strong> {selectedItem.data.driver}
              </div>
              <div>
                <strong>Route:</strong> {selectedItem.data.route}
              </div>
              <div>
                <strong>Status:</strong>
                <Badge variant={selectedItem.data.status === "warning" ? "destructive" : "default"} className="ml-2">
                  {selectedItem.data.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Navigation className="h-4 w-4 mr-1" />
                  Track
                </Button>
                <Button size="sm" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Alert
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Name:</strong> {selectedItem.data.name}
              </div>
              <div>
                <strong>Type:</strong> {selectedItem.data.type.replace("_", " ")}
              </div>
              <div>
                <strong>Radius:</strong> {selectedItem.data.radius * 100}m
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <MapPin className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Monitor
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 center bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-600">
          🖱️ Click and drag to rotate • 🔍 Scroll to zoom • 📱 Click objects for details
        </p>
      </div>
    </div>
  )
}
