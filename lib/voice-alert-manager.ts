"use client"

import VoiceService, { type SpeakOptions } from "./voice-service"

export interface VoiceAlert {
  id: string
  message: string
  priority: "low" | "normal" | "high" | "critical"
  repeat?: number // Number of times to repeat the alert
  interval?: number // Interval between repeats in milliseconds
  expiresAt?: number // Timestamp when the alert expires
}

export class VoiceAlertManager {
  private static instance: VoiceAlertManager
  private voiceService: VoiceService
  private activeAlerts: Map<string, VoiceAlert> = new Map()
  private alertIntervals: Map<string, NodeJS.Timeout> = new Map()
  private isEnabled = true
  private volumeLevel = 1.0 // 0.0 to 1.0

  private constructor() {
    this.voiceService = VoiceService.getInstance()
  }

  static getInstance(): VoiceAlertManager {
    if (!VoiceAlertManager.instance) {
      VoiceAlertManager.instance = new VoiceAlertManager()
    }
    return VoiceAlertManager.instance
  }

  // Enable or disable voice alerts
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled

    if (!enabled) {
      this.cancelAllAlerts()
    }
  }

  // Set volume level for alerts
  setVolume(volume: number): void {
    this.volumeLevel = Math.max(0, Math.min(1, volume))
  }

  // Add a new voice alert
  addAlert(alert: VoiceAlert): string {
    if (!this.isEnabled) return alert.id

    // Cancel any existing alert with the same ID
    if (this.activeAlerts.has(alert.id)) {
      this.cancelAlert(alert.id)
    }

    // Store the alert
    this.activeAlerts.set(alert.id, alert)

    // Speak the alert immediately
    this.speakAlert(alert)

    // Set up repeating alerts if needed
    if (alert.repeat && alert.repeat > 1 && alert.interval) {
      const intervalId = setInterval(() => {
        // Check if alert is still active and not expired
        if (this.activeAlerts.has(alert.id)) {
          const currentAlert = this.activeAlerts.get(alert.id)!

          if (currentAlert.expiresAt && Date.now() > currentAlert.expiresAt) {
            this.cancelAlert(alert.id)
            return
          }

          this.speakAlert(currentAlert)
        } else {
          // Alert was cancelled, clear the interval
          if (this.alertIntervals.has(alert.id)) {
            clearInterval(this.alertIntervals.get(alert.id)!)
            this.alertIntervals.delete(alert.id)
          }
        }
      }, alert.interval)

      this.alertIntervals.set(alert.id, intervalId)
    }

    return alert.id
  }

  // Cancel a specific alert
  cancelAlert(alertId: string): void {
    if (this.alertIntervals.has(alertId)) {
      clearInterval(this.alertIntervals.get(alertId)!)
      this.alertIntervals.delete(alertId)
    }

    this.activeAlerts.delete(alertId)
  }

  // Cancel all active alerts
  cancelAllAlerts(): void {
    // Clear all intervals
    this.alertIntervals.forEach((intervalId) => {
      clearInterval(intervalId)
    })

    this.alertIntervals.clear()
    this.activeAlerts.clear()

    // Cancel any current speech
    this.voiceService.cancelSpeech()
  }

  // Get all active alerts
  getActiveAlerts(): VoiceAlert[] {
    return Array.from(this.activeAlerts.values())
  }

  // Check if an alert is active
  isAlertActive(alertId: string): boolean {
    return this.activeAlerts.has(alertId)
  }

  // Speak an alert with appropriate options
  private speakAlert(alert: VoiceAlert): void {
    if (!this.isEnabled) return

    const options: SpeakOptions = {
      priority: alert.priority,
      volume: this.volumeLevel,
      interruptible: alert.priority !== "critical",
    }

    this.voiceService.speak(alert.message, options)
  }

  // Create standard alert types
  static createCriticalAlert(message: string, options: Partial<VoiceAlert> = {}): VoiceAlert {
    return {
      id: `critical-${Date.now()}`,
      message,
      priority: "critical",
      repeat: options.repeat || 3,
      interval: options.interval || 10000, // 10 seconds
      expiresAt: options.expiresAt,
    }
  }

  static createDriverAlert(driverName: string, alertType: string, options: Partial<VoiceAlert> = {}): VoiceAlert {
    let message = ""
    let priority: "low" | "normal" | "high" | "critical" = "normal"

    switch (alertType) {
      case "drowsiness":
        message = `Alert! Driver ${driverName} showing signs of drowsiness.`
        priority = "critical"
        break
      case "distraction":
        message = `Alert! Driver ${driverName} is distracted.`
        priority = "high"
        break
      case "phone_usage":
        message = `Alert! Driver ${driverName} is using phone while driving.`
        priority = "high"
        break
      case "speeding":
        message = `Alert! Driver ${driverName} is exceeding speed limit.`
        priority = "high"
        break
      default:
        message = `Alert for driver ${driverName}: ${alertType}`
        priority = "normal"
    }

    return {
      id: `driver-${alertType}-${Date.now()}`,
      message,
      priority,
      repeat: options.repeat || (priority === "critical" ? 3 : 1),
      interval: options.interval || (priority === "critical" ? 10000 : 0),
      expiresAt: options.expiresAt,
    }
  }

  static createVehicleAlert(vehicleId: string, alertType: string, options: Partial<VoiceAlert> = {}): VoiceAlert {
    let message = ""
    let priority: "low" | "normal" | "high" | "critical" = "normal"

    switch (alertType) {
      case "maintenance_due":
        message = `Vehicle ${vehicleId} is due for maintenance.`
        priority = "normal"
        break
      case "breakdown":
        message = `Alert! Vehicle ${vehicleId} has reported a breakdown.`
        priority = "high"
        break
      case "accident":
        message = `Critical alert! Vehicle ${vehicleId} has reported an accident.`
        priority = "critical"
        break
      default:
        message = `Alert for vehicle ${vehicleId}: ${alertType}`
        priority = "normal"
    }

    return {
      id: `vehicle-${alertType}-${Date.now()}`,
      message,
      priority,
      repeat: options.repeat || (priority === "critical" ? 3 : 1),
      interval: options.interval || (priority === "critical" ? 10000 : 0),
      expiresAt: options.expiresAt,
    }
  }

  static createRouteAlert(routeId: string, alertType: string, options: Partial<VoiceAlert> = {}): VoiceAlert {
    let message = ""
    let priority: "low" | "normal" | "high" | "critical" = "normal"

    switch (alertType) {
      case "deviation":
        message = `Route alert! Vehicle on route ${routeId} has deviated from planned route.`
        priority = "normal"
        break
      case "delay":
        message = `Route ${routeId} is experiencing delays.`
        priority = "low"
        break
      case "hazard":
        message = `Warning! Hazard reported on route ${routeId}.`
        priority = "high"
        break
      default:
        message = `Alert for route ${routeId}: ${alertType}`
        priority = "normal"
    }

    return {
      id: `route-${alertType}-${Date.now()}`,
      message,
      priority,
      repeat: options.repeat || 1,
      interval: options.interval || 0,
      expiresAt: options.expiresAt,
    }
  }
}
