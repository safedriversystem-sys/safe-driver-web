import type { Metadata } from "next"
import { Settings } from "@/components/settings/settings"

export const metadata: Metadata = {
  title: "System Settings | SafeDriver",
  description: "Configure system settings for your SafeDriver platform",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your SafeDriver system settings and preferences.</p>
        </div>
        <Settings />
      </div>
    </div>
  )
}
