"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Mic, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceSettings() {
  const [isVoiceCommandsEnabled, setIsVoiceCommandsEnabled] = useState(true)
  const [isSupported, setIsSupported] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports speech recognition and synthesis
    const checkSupport = () => {
      const speechRecognitionSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      const speechSynthesisSupported = "speechSynthesis" in window
      setIsSupported(speechRecognitionSupported && speechSynthesisSupported)
    }

    checkSupport()

    // Load settings from localStorage
    const savedVoiceCommandsEnabled = localStorage.getItem("safedriver-voice-commands-enabled")
    if (savedVoiceCommandsEnabled !== null) {
      setIsVoiceCommandsEnabled(savedVoiceCommandsEnabled === "true")
    }
  }, [])

  const handleVoiceCommandsToggle = (enabled: boolean) => {
    setIsVoiceCommandsEnabled(enabled)
    localStorage.setItem("safedriver-voice-commands-enabled", String(enabled))
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Configure voice commands for hands-free operation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Voice features not supported</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your browser does not support speech synthesis or recognition. Try using a modern browser like Chrome or
                Edge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Settings</CardTitle>
        <CardDescription>Configure voice commands for hands-free operation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-commands">Voice Commands</Label>
              <p className="text-sm text-gray-500">Control the app using voice commands</p>
            </div>
            <Switch id="voice-commands" checked={isVoiceCommandsEnabled} onCheckedChange={handleVoiceCommandsToggle} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Voice Command Test",
              description: "Voice command test initiated",
              duration: 3000,
            })
          }}
          disabled={!isVoiceCommandsEnabled}
          className="flex items-center gap-2"
        >
          <Mic className="h-4 w-4" />
          Test Commands
        </Button>
      </CardFooter>
    </Card>
  )
}
