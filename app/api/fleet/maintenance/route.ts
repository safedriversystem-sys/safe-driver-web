import { type NextRequest, NextResponse } from "next/server"
import { fleetService } from "@/lib/fleet-service"
import { initializeFirebase } from "@/lib/firebase/config"
import { z } from "zod"

// Initialize Firebase on server side
try {
  initializeFirebase()
} catch (error) {
  console.error("Firebase initialization error:", error)
}

const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  type: z.string().min(1, "Maintenance type is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  priority: z.enum(["low", "medium", "high"]),
  estimatedCost: z.number().min(0),
  description: z.string().optional(),
})

// GET /api/fleet/maintenance - Get all maintenance schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicleId") || undefined

    const schedules = await fleetService.getAllMaintenanceSchedules(vehicleId)
    return NextResponse.json(schedules)
  } catch (error: any) {
    console.error("Error in GET /api/fleet/maintenance:", error)
    const errorMessage = error?.message || "Failed to fetch maintenance schedules"

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST /api/fleet/maintenance - Create a new maintenance schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createMaintenanceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const schedule = await fleetService.createMaintenanceSchedule(validationResult.data)

    return NextResponse.json(schedule, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/fleet/maintenance:", error)
    const errorMessage = error?.message || "Failed to create maintenance schedule"

    if (errorMessage.includes("not found")) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

