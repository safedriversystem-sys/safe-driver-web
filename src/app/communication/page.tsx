"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Phone, Video, AlertTriangle, Send } from "lucide-react"

// Mock data for drivers
const mockDrivers = [
  {
    id: "d1",
    name: "Kamal Perera",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "I'll be at the depot in 10 minutes",
    unread: 2,
    lastActive: "2 min ago",
    vehicle: "NB-1234",
    route: "Colombo - Kandy",
  },
  {
    id: "d2",
    name: "Sunil Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "driving",
    lastMessage: "Traffic is heavy on Main Street",
    unread: 0,
    lastActive: "15 min ago",
    vehicle: "WP-5678",
    route: "Galle - Matara",
  },
  {
    id: "d3",
    name: "Nimal Jayawardena",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Completed my route for today",
    unread: 0,
    lastActive: "1 hour ago",
    vehicle: "CP-9012",
    route: "Negombo - Colombo",
  },
  {
    id: "d4",
    name: "Amal Fernando",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Taking my break now",
    unread: 1,
    lastActive: "5 min ago",
    vehicle: "SP-3456",
    route: "Kandy - Nuwara Eliya",
  },
  {
    id: "d5",
    name: "Saman Kumara",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "driving",
    lastMessage: "Will arrive at the next stop in 10 minutes",
    unread: 0,
    lastActive: "30 min ago",
    vehicle: "NW-7890",
    route: "Anuradhapura - Polonnaruwa",
  },
]

// Mock messages for a conversation
const mockMessages = [
  {
    id: "m1",
    senderId: "admin",
    text: "How's your route going today?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "read",
  },
  {
    id: "m2",
    senderId: "d1",
    text: "All good so far. Traffic is normal.",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    status: "read",
  },
  {
    id: "m3",
    senderId: "admin",
    text: "Great! Remember to take your break at 2pm.",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    status: "read",
  },
  {
    id: "m4",
    senderId: "d1",
    text: "Will do. I'll be at the depot in 10 minutes.",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    status: "delivered",
  },
]

export default function CommunicationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState<string | null>("d1") // Default to first driver
  const [message, setMessage] = useState("")

  const filteredDrivers = mockDrivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.route.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message via the chat service
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeDriver = mockDrivers.find((d) => d.id === activeChat)

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Communication Center</h1>
          <p className="text-gray-500">Manage all driver communications in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Driver List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search drivers, vehicles, or routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              <Tabs defaultValue="recent">
                <div className="px-4 border-b">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="recent" className="flex-1">
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex-1">
                      All Drivers
                    </TabsTrigger>
                    <TabsTrigger value="emergency" className="flex-1">
                      Emergency
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recent" className="m-0">
                  {filteredDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b ${
                        activeChat === driver.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setActiveChat(driver.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={driver.avatar || "/placeholder.svg"} alt={driver.name} />
                            <AvatarFallback>{driver.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                              driver.status === "online"
                                ? "bg-green-500"
                                : driver.status === "driving"
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{driver.name}</p>
                            <span className="text-xs text-gray-500">{driver.vehicle}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{driver.lastMessage}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">{driver.lastActive}</span>
                        {driver.unread > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-[20px] px-1 mt-1">
                            {driver.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="all" className="m-0">
                  <div className="p-4 text-center text-gray-500">All drivers would be listed here</div>
                </TabsContent>

                <TabsContent value="emergency" className="m-0">
                  <div className="p-4 text-center text-gray-500">Emergency communications would be listed here</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {activeChat && activeDriver ? (
              <>
                <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeDriver.avatar || "/placeholder.svg"} alt={activeDriver.name} />
                      <AvatarFallback>{activeDriver.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activeDriver.name}</p>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            activeDriver.status === "online"
                              ? "bg-green-500"
                              : activeDriver.status === "driving"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-500">
                          {activeDriver.status === "online"
                            ? "Online"
                            : activeDriver.status === "driving"
                              ? "Driving"
                              : "Offline"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {activeDriver.vehicle} • {activeDriver.route}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0 overflow-y-auto flex-1">
                  <div className="flex flex-col gap-4 p-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === "admin" ? "justify-end" : "justify-start"} items-end gap-2`}
                      >
                        {msg.senderId !== "admin" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={mockDrivers.find((d) => d.id === msg.senderId)?.avatar || "/placeholder.svg"}
                              alt={mockDrivers.find((d) => d.id === msg.senderId)?.name || ""}
                            />
                            <AvatarFallback>
                              {mockDrivers.find((d) => d.id === msg.senderId)?.name.substring(0, 2) || ""}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg max-w-[75%] ${
                            msg.senderId === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {msg.senderId === "admin" && (
                          <div className="text-xs text-gray-500 mb-1">{msg.status === "read" ? "Read" : "Sent"}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-gray-500">Select a driver to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
