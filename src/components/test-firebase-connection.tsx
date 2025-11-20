"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { realtimeDbService } from "@/lib/firebase/realtime-db"
import { initializeFirebase } from "@/lib/firebase/config"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function TestFirebaseConnection() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
  } | null>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      // Initialize Firebase
      console.log("🧪 Testing Firebase connection...")
      initializeFirebase()
      console.log("✅ Firebase initialized")

      // Test reading from alerts path
      console.log("🧪 Testing /alerts path...")
      const alertsData = await realtimeDbService.get("alerts")
      console.log("📊 Alerts data:", alertsData)

      // Test reading specific device
      console.log("🧪 Testing /alerts/14:85:7F:BF:40:78 path...")
      const deviceData = await realtimeDbService.get("alerts/14:85:7F:BF:40:78")
      console.log("📊 Device data:", deviceData)

      // Test reading latest alert
      console.log("🧪 Testing /alerts/14:85:7F:BF:40:78/latest path...")
      const latestData = await realtimeDbService.get("alerts/14:85:7F:BF:40:78/latest")
      console.log("📊 Latest alert data:", latestData)

      if (alertsData === null) {
        setResult({
          success: false,
          message: "Cannot read from /alerts - Check database rules!",
          data: null,
        })
      } else if (!deviceData) {
        setResult({
          success: false,
          message: "Device 14:85:7F:BF:40:78 not found in /alerts",
          data: alertsData,
        })
      } else if (!latestData) {
        setResult({
          success: false,
          message: "No latest alert found for device 14:85:7F:BF:40:78",
          data: deviceData,
        })
      } else {
        setResult({
          success: true,
          message: "Connection successful! Alert data found.",
          data: latestData,
        })
      }
    } catch (error: any) {
      console.error("❌ Test failed:", error)
      setResult({
        success: false,
        message: error.message || "Connection test failed",
        data: null,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
        <CardDescription>Test if Firebase Realtime Database is accessible</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={testConnection} disabled={testing} className="mb-4">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-md border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                  {result.message}
                </p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-gray-600">View data</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

