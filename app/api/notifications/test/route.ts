import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configure web-push
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY || "your-vapid-public-key",
  process.env.VAPID_PRIVATE_KEY || "your-vapid-private-key",
)

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json()

    const payload = {
      title: "SafeDriver Test Notification",
      body: "Push notifications are working correctly! 🎉",
      type: "general",
      tag: "test-notification",
      data: {
        url: "/",
        timestamp: Date.now(),
      },
    }

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    }

    await webpush.sendNotification(pushSubscription, JSON.stringify(payload))

    return NextResponse.json({
      success: true,
      message: "Test notification sent successfully",
    })
  } catch (error: any) {
    console.error("Failed to send test notification:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test notification",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
