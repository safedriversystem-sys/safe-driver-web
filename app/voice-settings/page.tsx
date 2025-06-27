"use client"

import { VoiceSettings } from "@/components/voice-settings"

export default function VoiceSettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Voice Settings</h1>
      <VoiceSettings />
    </div>
  )
}
