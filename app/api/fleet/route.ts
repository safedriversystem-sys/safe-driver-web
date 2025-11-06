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

const createVehicleSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  driverId: z.string().optional(),
  driverName: z.string().optional(),
  route: z.string().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
    })
    .optional(),
  fuel: z.number().min(0).max(100).optional(),
  mileage: z.number().min(0).optional(),
  status: z.enum(["active", "maintenance", "inactive"]).optional(),
})

// GET /api/fleet - Get all vehicles with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      status: searchParams.get("status") || undefined,
      maintenanceStatus: searchParams.get("maintenanceStatus") || undefined,
      search: searchParams.get("search") || undefined,
      driverId: searchParams.get("driverId") || undefined,
    }

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const vehicles = await fleetService.getAllVehicles(filters as any)
    return NextResponse.json(vehicles)
  } catch (error: any) {
    console.error("Error in GET /api/fleet:", error)
    const errorMessage = error?.message || "Failed to fetch vehicles"

    if (errorMessage.includes("Firebase not configured") || errorMessage.includes("configuration missing")) {
      return NextResponse.json(
        {
          error: "Firebase not configured. Please set up Firebase by creating .env.local file. See SETUP_GUIDE.md for instructions.",
          details: errorMessage,
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST /api/fleet - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createVehicleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    // Ensure Firebase is initialized
    try {
      initializeFirebase()
    } catch (initError: any) {
      console.error("Firebase initialization failed:", initError)
      return NextResponse.json(
        {
          error: "Firebase initialization failed",
          details: initError?.message || "Unknown error",
          hint: "Please check your .env.local file and ensure Firebase emulators are running",
        },
        { status: 503 },
      )
    }

    const vehicle = await fleetService.createVehicle(validationResult.data)

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/fleet:", error)
    const errorMessage = error?.message || "Failed to create vehicle"

    if (errorMessage.includes("Firebase not configured") || errorMessage.includes("configuration missing")) {
      return NextResponse.json(
        {
          error: "Firebase not configured. Please set up Firebase by creating .env.local file. See SETUP_GUIDE.md for instructions.",
          details: errorMessage,
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

