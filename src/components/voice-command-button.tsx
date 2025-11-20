"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
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

    // Restore voice settings from localStorage
    const voiceEnabled = localStorage.getItem("safedriver-voice-enabled")
    if (voiceEnabled !== null) {
      setIsVoiceEnabled(voiceEnabled === "true")
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      // Stop listening logic would go here
      setIsListening(false)
    } else {
      // Start listening logic would go here
      setIsListening(true)

      // Simulate stopping after 5 seconds
      setTimeout(() => {
        setIsListening(false)
      }, 5000)

      toast({
        title: "Voice commands activated",
        description: "Try saying 'Show alerts' or 'Go to dashboard'",
        duration: 3000,
      })
    }
  }

  const toggleVoiceEnabled = () => {
    const newState = !isVoiceEnabled
    setIsVoiceEnabled(newState)

    // Save preference
    localStorage.setItem("safedriver-voice-enabled", String(newState))

    // Feedback
    toast({
      title: newState ? "Voice alerts enabled" : "Voice alerts disabled",
      description: newState ? "You will now receive voice alerts" : "You will no longer receive voice alerts",
      duration: 3000,
    })
  }

  if (!isSupported) {
    return null // Don't render if voice features aren't supported
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:bottom-6">
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full w-12 h-12 shadow-lg ${
          isVoiceEnabled ? "bg-green-100 hover:bg-green-200" : "bg-gray-100 hover:bg-gray-200"
        }`}
        onClick={toggleVoiceEnabled}
        title={isVoiceEnabled ? "Disable voice alerts" : "Enable voice alerts"}
      >
        {isVoiceEnabled ? (
          <Volume2 className="h-5 w-5 text-green-600" />
        ) : (
          <VolumeX className="h-5 w-5 text-gray-600" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`rounded-full w-12 h-12 shadow-lg ${
          isListening ? "bg-blue-100 hover:bg-blue-200 animate-pulse" : "bg-gray-100 hover:bg-gray-200"
        }`}
        onClick={toggleListening}
        title={isListening ? "Stop listening" : "Start voice commands"}
      >
        {isListening ? <Mic className="h-5 w-5 text-blue-600" /> : <MicOff className="h-5 w-5 text-gray-600" />}
      </Button>
    </div>
  )
}
