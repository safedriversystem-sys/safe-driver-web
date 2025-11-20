"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Volume2, Mic, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceSettings() {
  const [isVoiceAlertsEnabled, setIsVoiceAlertsEnabled] = useState(true)
  const [isVoiceCommandsEnabled, setIsVoiceCommandsEnabled] = useState(true)
  const [volume, setVolume] = useState(80)
  const [rate, setRate] = useState(10)
  const [pitch, setPitch] = useState(10)
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
    const savedVoiceAlertsEnabled = localStorage.getItem("safedriver-voice-alerts-enabled")
    const savedVoiceCommandsEnabled = localStorage.getItem("safedriver-voice-commands-enabled")
    const savedVolume = localStorage.getItem("safedriver-voice-volume")
    const savedRate = localStorage.getItem("safedriver-voice-rate")
    const savedPitch = localStorage.getItem("safedriver-voice-pitch")

    if (savedVoiceAlertsEnabled !== null) {
      setIsVoiceAlertsEnabled(savedVoiceAlertsEnabled === "true")
    }

    if (savedVoiceCommandsEnabled !== null) {
      setIsVoiceCommandsEnabled(savedVoiceCommandsEnabled === "true")
    }

    if (savedVolume !== null) {
      setVolume(Number.parseInt(savedVolume, 10))
    }

    if (savedRate !== null) {
      setRate(Number.parseInt(savedRate, 10))
    }

    if (savedPitch !== null) {
      setPitch(Number.parseInt(savedPitch, 10))
    }
  }, [])

  const handleVoiceAlertsToggle = (enabled: boolean) => {
    setIsVoiceAlertsEnabled(enabled)
    localStorage.setItem("safedriver-voice-alerts-enabled", String(enabled))
  }

  const handleVoiceCommandsToggle = (enabled: boolean) => {
    setIsVoiceCommandsEnabled(enabled)
    localStorage.setItem("safedriver-voice-commands-enabled", String(enabled))
  }

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0]
    setVolume(vol)
    localStorage.setItem("safedriver-voice-volume", String(vol))
  }

  const handleRateChange = (value: number[]) => {
    const r = value[0]
    setRate(r)
    localStorage.setItem("safedriver-voice-rate", String(r))
  }

  const handlePitchChange = (value: number[]) => {
    const p = value[0]
    setPitch(p)
    localStorage.setItem("safedriver-voice-pitch", String(p))
  }

  const testVoice = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "This is a test of the SafeDriver voice alert system. You will hear alerts like this for critical safety events.",
      )
      utterance.volume = volume / 100
      utterance.rate = rate / 10
      utterance.pitch = pitch / 10
      window.speechSynthesis.speak(utterance)

      toast({
        title: "Voice Test",
        description: "Playing voice test...",
        duration: 3000,
      })
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Configure voice alerts and commands</CardDescription>
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
        <CardDescription>Configure voice alerts and commands</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-alerts">Voice Alerts</Label>
              <p className="text-sm text-gray-500">Receive spoken alerts for critical events</p>
            </div>
            <Switch id="voice-alerts" checked={isVoiceAlertsEnabled} onCheckedChange={handleVoiceAlertsToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-commands">Voice Commands</Label>
              <p className="text-sm text-gray-500">Control the app using voice commands</p>
            </div>
            <Switch id="voice-commands" checked={isVoiceCommandsEnabled} onCheckedChange={handleVoiceCommandsToggle} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume-slider">Volume: {volume}%</Label>
            </div>
            <Slider
              id="volume-slider"
              defaultValue={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              disabled={!isVoiceAlertsEnabled}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-slider">Speech Rate: {(rate / 10).toFixed(1)}x</Label>
            </div>
            <Slider
              id="rate-slider"
              defaultValue={[rate]}
              min={5}
              max={20}
              step={1}
              onValueChange={handleRateChange}
              disabled={!isVoiceAlertsEnabled}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pitch-slider">Pitch: {(pitch / 10).toFixed(1)}</Label>
            </div>
            <Slider
              id="pitch-slider"
              defaultValue={[pitch]}
              min={5}
              max={20}
              step={1}
              onValueChange={handlePitchChange}
              disabled={!isVoiceAlertsEnabled}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={testVoice}
          disabled={!isVoiceAlertsEnabled}
          className="flex items-center gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Test Voice
        </Button>

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
