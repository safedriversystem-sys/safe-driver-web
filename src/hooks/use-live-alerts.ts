import { useState, useEffect } from "react"
import { realtimeDbService } from "@/lib/firebase/realtime-db"
import { initializeFirebase } from "@/lib/firebase/config"
import { DataSnapshot } from "firebase/database"

export interface FirebaseAlert {
  message: string
  tag: string
  time: string
  type: string
  number_plate?: string
}

export interface DeviceAlert {
  deviceId: string
  latest?: FirebaseAlert
  history?: Record<string, FirebaseAlert>
}

export interface Alert {
  id: string
  type: string
  severity: "high" | "medium" | "low"
  driverName: string
  driverId: string
  busNumber: string
  route: string
  location: string
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
  description: string
  deviceId?: string
  tag?: string
  number_plate?: string
}

// Map Firebase alert types to UI alert types
const mapAlertType = (type: string, tag: string): string => {
  const lowerType = type.toLowerCase()
  const lowerTag = tag.toLowerCase()

  if (lowerType.includes("head") || lowerType.includes("turn") || lowerTag.includes("distraction")) {
    return "distraction"
  }
  if (lowerType.includes("drowsy") || lowerTag.includes("drowsiness")) {
    return "drowsiness"
  }
  if (lowerType.includes("phone") || lowerTag.includes("phone")) {
    return "phone_usage"
  }
  if (lowerType.includes("speed") || lowerTag.includes("speed")) {
    return "speeding"
  }
  if (lowerTag.includes("maintenance")) {
    return "maintenance"
  }
  return "distraction" // default
}

// Map alert type to severity
const getSeverity = (type: string, tag: string): "high" | "medium" | "low" => {
  const lowerType = type.toLowerCase()
  const lowerTag = tag.toLowerCase()

  if (lowerType.includes("drowsy") || lowerTag.includes("critical") || lowerTag.includes("distraction")) {
    return "high"
  }
  if (lowerType.includes("phone") || lowerType.includes("speed")) {
    return "medium"
  }
  return "low"
}

// Device information interface (matches actual Firebase structure)
interface DeviceInfo {
  // Actual fields from Firebase
  is_registered?: boolean
  is_verified?: boolean
  last_active_date_time?: string
  last_updated_date_time?: string
  registered_date_time?: string
  status?: string
  vehicle_reg_no?: string
  number_plate?: string
  
  // Optional fields that might exist
  driverName?: string
  driverId?: string
  busNumber?: string
  route?: string
  location?: string
  [key: string]: any
}

// Transform Firebase alert to UI alert format
const transformAlert = (deviceId: string, alert: FirebaseAlert, deviceInfo?: DeviceInfo): Alert => {
  const alertType = mapAlertType(alert.type, alert.tag)
  const severity = getSeverity(alert.type, alert.tag)

  // Extract device info from actual Firebase structure
  // Get number_plate from alert data, device info, or vehicle_reg_no
  const number_plate = alert.number_plate || deviceInfo?.number_plate || deviceInfo?.vehicle_reg_no?.trim() || ""
  
  // Use number_plate as busNumber if available, otherwise use deviceInfo busNumber
  // If number_plate exists, use it for busNumber too (to avoid duplication)
  const busNumber = number_plate || deviceInfo?.busNumber || ""
  
  // Use provided driver info or generate defaults
  const driverName = deviceInfo?.driverName || `Driver ${deviceId.substring(0, 8)}`
  const driverId = deviceInfo?.driverId || `DRV-${deviceId.substring(0, 8)}`
  
  // Use provided route/location or defaults
  const route = deviceInfo?.route || "Unknown Route"
  const location = deviceInfo?.location || (deviceInfo?.status === "online" ? "Online" : "Unknown Location")

  // Generate unique ID from deviceId and timestamp
  const alertId = `${deviceId}-${alert.time || Date.now()}`

  return {
    id: alertId,
    type: alertType,
    severity,
    driverName,
    driverId,
    busNumber,
    route,
    location,
    timestamp: alert.time,
    status: "active",
    description: alert.message,
    deviceId,
    tag: alert.tag,
    number_plate,
  }
}

export function useLiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [historyAlerts, setHistoryAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [devices, setDevices] = useState<Record<string, DeviceInfo>>({})

  // Initialize Firebase and listen to devices for device information
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      // Initialize Firebase first
      initializeFirebase()
      console.log("✅ Firebase initialized for live alerts")

      const { unsubscribe: unsubscribeDevices } = realtimeDbService.onValue("devices", (snapshot: DataSnapshot) => {
        try {
          const devicesData = snapshot.val()
          console.log("📱 Devices data received:", devicesData)
          if (devicesData) {
            setDevices(devicesData)
          }
        } catch (err) {
          console.error("❌ Error loading devices:", err)
        }
      })

      return () => {
        unsubscribeDevices()
      }
    } catch (err) {
      console.error("❌ Error initializing Firebase:", err)
      setError(err instanceof Error ? err : new Error("Failed to initialize Firebase"))
    }
  }, [])

  // Listen to alerts
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Initialize Firebase first
      initializeFirebase()
      console.log("🔔 Setting up alerts listener...")

      // Test connection first
      console.log("🔍 Testing Firebase connection...")
      realtimeDbService.get("alerts").then((testData) => {
        console.log("🧪 Test fetch result:", testData)
        if (testData === null) {
          console.error("❌ Cannot read from /alerts path - check database rules!")
          console.error("❌ This usually means:")
          console.error("   1. Database rules don't allow read access")
          console.error("   2. Path /alerts doesn't exist")
          console.error("   3. You need to deploy database rules: firebase deploy --only database")
          setError(new Error("Cannot read from Firebase /alerts path. Check database rules allow read access."))
        } else if (testData) {
          console.log("✅ Successfully connected to Firebase!")
          console.log("✅ Found data at /alerts:", Object.keys(testData))
        }
      }).catch((err) => {
        console.error("❌ Test fetch failed:", err)
        console.error("❌ Error details:", {
          message: err.message,
          code: (err as any).code,
          stack: err.stack,
        })
        setError(err instanceof Error ? err : new Error("Failed to connect to Firebase"))
      })

      // Listen to real-time changes in the alerts path
      const { unsubscribe } = realtimeDbService.onValue("alerts", (snapshot: DataSnapshot) => {
        try {
          console.log("📡 Firebase snapshot received")
          console.log("📡 Snapshot exists:", snapshot.exists())
          console.log("📡 Snapshot key:", snapshot.key)
          
          const data = snapshot.val()
          console.log("📊 Alerts data received from Firebase:", data)
          console.log("📊 Data type:", typeof data)
          console.log("📊 Is null:", data === null)
          console.log("📊 Is undefined:", data === undefined)
          console.log("📊 Data keys:", data ? Object.keys(data) : "null")

          if (!data || data === null) {
            console.log("⚠️ No alerts data found in Firebase - path /alerts is empty or null")
            console.log("⚠️ This could mean:")
            console.log("   1. Database rules don't allow read access")
            console.log("   2. Path /alerts doesn't exist")
            console.log("   3. Path /alerts is empty")
            setAlerts([])
            setIsLoading(false)
            return
          }

          // Transform Firebase data structure to alerts array
          const transformedAlerts: Alert[] = []

          // Iterate through each device
          const deviceIds = Object.keys(data)
          console.log(`🔍 Found ${deviceIds.length} device(s):`, deviceIds)

          // Separate arrays for latest and history alerts
          const historyAlertsList: Alert[] = []

          deviceIds.forEach((deviceId) => {
            const deviceAlert: any = data[deviceId]
            console.log(`🔍 Processing device ${deviceId}:`, deviceAlert)
            console.log(`🔍 Device alert type:`, typeof deviceAlert)
            console.log(`🔍 Device alert keys:`, deviceAlert ? Object.keys(deviceAlert) : "null")

            const deviceInfo = devices[deviceId]

            // Process latest alert
            if (deviceAlert && deviceAlert.latest) {
              const latest = deviceAlert.latest
              console.log(`✅ Found latest alert for ${deviceId}:`, latest)

              // Validate required fields
              if (!latest.message || !latest.tag || !latest.time || !latest.type) {
                console.warn(`⚠️ Incomplete alert data for ${deviceId}:`, latest)
                console.warn(`   Missing fields:`, {
                  message: !latest.message,
                  tag: !latest.tag,
                  time: !latest.time,
                  type: !latest.type,
                })
              } else {
                console.log(`📱 Device info for ${deviceId}:`, deviceInfo)
                const alert = transformAlert(deviceId, latest as FirebaseAlert, deviceInfo)
                console.log(`✅ Transformed alert for ${deviceId}:`, alert)
                transformedAlerts.push(alert)
              }
            } else {
              console.log(`⚠️ No latest alert for device ${deviceId}`, {
                hasDeviceAlert: !!deviceAlert,
                hasLatest: !!(deviceAlert && deviceAlert.latest),
              })
            }

            // Process history alerts
            if (deviceAlert && deviceAlert.history) {
              const history = deviceAlert.history
              console.log(`📜 Found history for ${deviceId}:`, Object.keys(history).length, "alerts")
              
              Object.keys(history).forEach((historyKey) => {
                const historyAlert = history[historyKey] as FirebaseAlert
                if (historyAlert && historyAlert.message && historyAlert.tag && historyAlert.time && historyAlert.type) {
                  const alert = transformAlert(deviceId, historyAlert, deviceInfo)
                  // Mark history alerts as resolved by default
                  alert.status = "resolved"
                  historyAlertsList.push(alert)
                  console.log(`✅ Added history alert: ${alert.id}`)
                }
              })
            } else {
              console.log(`⚠️ No history found for device ${deviceId}`)
            }
          })

          // Sort by timestamp (newest first)
          transformedAlerts.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime()
            const timeB = new Date(b.timestamp).getTime()
            return timeB - timeA
          })

          // Sort history alerts by timestamp (newest first)
          historyAlertsList.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime()
            const timeB = new Date(b.timestamp).getTime()
            return timeB - timeA
          })

          console.log(`✅ Total latest alerts processed: ${transformedAlerts.length}`, transformedAlerts)
          console.log(`✅ Total history alerts processed: ${historyAlertsList.length}`, historyAlertsList)
          setAlerts(transformedAlerts)
          setHistoryAlerts(historyAlertsList)
          setIsLoading(false)
        } catch (err) {
          console.error("❌ Error processing alerts:", err)
          setError(err instanceof Error ? err : new Error("Unknown error"))
          setIsLoading(false)
        }
      })

      // Cleanup subscription on unmount
      return () => {
        unsubscribe()
      }
    } catch (err) {
      console.error("❌ Error setting up alerts listener:", err)
      setError(err instanceof Error ? err : new Error("Failed to set up alerts listener"))
      setIsLoading(false)
    }
  }, [devices]) // Re-run when devices data changes

  return { alerts, historyAlerts, isLoading, error }
}

